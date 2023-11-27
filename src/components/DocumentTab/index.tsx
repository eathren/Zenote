import React, { useState, useEffect, useRef, useCallback } from "react"
import { Input, Drawer, Typography, Button } from "antd"
import Markdown from "react-markdown"
import { useParams } from "react-router-dom"
import AddEdgeModal from "../AddEdgeModal"
import { useNodes } from "src/hooks/useNodes"
import { batchUpdateNodeEdges } from "src/handles/edges"
import { GraphEdge } from "src/types"
import { batchUpdateNodeTags } from "src/handles/nodes"
import LoadingSpinner from "../LoadingSpinner"

type DocumentTabProps = {
  markdownContent: string
  isLoading: boolean
  nodeTitle: string
  handleEditorChange: (newValue?: string | undefined) => void
  handleTitleChange: (newTitle: string) => void
}

const commonStyle = {
  border: "none",
  outline: "none",
  fontFamily: "inherit",
  fontSize: "inherit",
  margin: 0,
  padding: 0,
}

const headerStyle = {
  ...commonStyle,
  fontWeight: 600,
  fontSize: "1.5rem",
  marginBottom: "1rem",
}

const inputStyle = {
  ...commonStyle,
  minHeight: "100vh",
}

const generateNewNodeURL = (nodeId: string | number) => {
  // Get the current URL
  const currentURL = window.location.href

  // Find the index of "graphs/"
  const graphsIndex = currentURL.indexOf("graphs/")

  if (graphsIndex === -1) {
    return null // 'graphs/' not found in the URL
  }

  // Extract the part of the URL up to and including the graph ID
  const graphIDEndIndex = currentURL.indexOf(
    "/",
    graphsIndex + "graphs/".length
  )

  if (graphIDEndIndex === -1) {
    return null // No slash found after 'graphs/'
  }

  const baseUrl = currentURL.slice(0, graphIDEndIndex)

  // Add your own part to the URL
  return `${baseUrl}/node/${nodeId}`
}

const DocumentTab: React.FC<DocumentTabProps> = ({
  markdownContent,
  isLoading,
  nodeTitle,
  handleEditorChange,
  handleTitleChange,
}) => {
  const { graphId, nodeId } = useParams<{ graphId: string; nodeId: string }>()
  const [editableTitle, setEditableTitle] = useState<string>(nodeTitle || "")
  const [isTitleEditable, setIsTitleEditable] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const [isEditing, setIsEditing] = useState(
    markdownContent.length > 0 ? false : true
  )
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<any>(null)
  const [showAddEdgeModal, setShowAddEdgeModal] = useState<boolean>(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [caretPosition, setCaretPosition] = useState<number | null>(null)
  const { nodes } = useNodes(graphId)
  const [prevMarkdownContent, setPrevMarkdownContent] =
    useState(markdownContent)

  const handleEditorChangeWithCheck = useCallback(
    (newValue: string | undefined) => {
      if (newValue !== prevMarkdownContent) {
        handleEditorChange(newValue)
        setPrevMarkdownContent(newValue || "")
      }
    },
    [handleEditorChange, prevMarkdownContent]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        titleRef.current &&
        !titleRef.current.contains(event.target as Node)
      ) {
        setIsTitleEditable(false)
        handleTitleChange(editableTitle)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editableTitle, handleTitleChange])

  useEffect(() => {
    if (isEditing && textAreaRef.current && cursorPosition !== null) {
      const textArea: HTMLTextAreaElement =
        textAreaRef.current.resizableTextArea.textArea
      textArea.focus()
      textArea.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [isEditing, cursorPosition])

  useEffect(() => {
    if (textAreaRef.current) {
      const textArea: HTMLTextAreaElement =
        textAreaRef.current.resizableTextArea.textArea
      textArea.focus()
    }
  }, [])

  const toggleTitleEdit = () => {
    setIsTitleEditable(!isTitleEditable)
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(e.target.value)
  }

  const onTitleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        setIsTitleEditable(false)
        handleTitleChange(editableTitle)
      }
    },
    [editableTitle, handleTitleChange]
  )

  const handleLineClick = (lineIndex: number) => {
    const linesBeforeClicked = markdownContent
      .split("\n")
      .slice(0, lineIndex)
      .join("\n")
    setCursorPosition(linesBeforeClicked.length + lineIndex)
    setIsEditing(true)
  }

  const handleCloseDrawer = () => {
    setShowDrawer(false)
  }

  const extractLinks = (content: string): string[] => {
    const links = content.match(/\/graphs\/[^/]+\/node\/([^)]+)/g) || []
    return links.map((link) => link.split("node/")[1])
  }

  const extractTags = (content: string): string[] => {
    const regex = /(?:\s|^)#[A-Za-z0-9_]+/g
    const matches = content.match(regex) || []
    return Array.from(new Set(matches.map((match) => match.trim().slice(1))))
  }

  const updateDynamicContent = useCallback(async () => {
    if (!graphId || !nodeId) return
    const node = nodes.find((node) => node.id === nodeId)
    if (!node) return
    const allTargetIds = extractLinks(markdownContent)
    const addedLinks = allTargetIds.filter(
      (localEdge) =>
        !node.edges?.some(
          (edge: GraphEdge) => (edge.target as string) === localEdge
        )
    )

    const deletedLinks = (
      node.edges?.map((edge: GraphEdge) => edge.target as string) || []
    ).filter((remoteEdge) => !allTargetIds.includes(remoteEdge))

    if (addedLinks.length || deletedLinks.length) {
      const result = await batchUpdateNodeEdges(
        graphId,
        nodeId,
        addedLinks,
        deletedLinks
      )
      if (!result) {
        console.error("Error updating edges.")
      }
    }

    const tagsInMarkdown = extractTags(markdownContent)
    const tagsInFirebase = node.tags || []

    const addedTags = tagsInMarkdown.filter(
      (tag) => !tagsInFirebase.includes(tag)
    )
    const deletedTags = tagsInFirebase.filter(
      (tag) => !tagsInMarkdown.includes(tag)
    )

    // console.log("Added tags:", addedTags, "Deleted tags:", deletedTags)

    if (addedTags.length || deletedTags.length) {
      const result = await batchUpdateNodeTags(
        graphId,
        nodeId,
        addedTags,
        deletedTags
      )
      if (!result) {
        console.error("Error updating tags.")
      }
    }
  }, [graphId, markdownContent, nodeId, nodes])

  useEffect(() => {
    updateDynamicContent()
  }, [updateDynamicContent, markdownContent])

  useEffect(() => {
    try {
      const regex = /\[\[/g
      const match = regex.exec(markdownContent)

      if (match && textAreaRef.current?.resizableTextArea?.textArea) {
        const capturedCaretPosition =
          textAreaRef.current.resizableTextArea.textArea.selectionStart

        if (capturedCaretPosition !== null) {
          setCaretPosition(capturedCaretPosition)

          const positionOfFirstBracket = markdownContent.indexOf("[[")
          if (positionOfFirstBracket !== -1) {
            // Remove both brackets
            const newContent =
              markdownContent.slice(0, positionOfFirstBracket) +
              markdownContent.slice(positionOfFirstBracket + 2)

            // Debug log to check the slice positions
            handleEditorChange(newContent)
            setCaretPosition(positionOfFirstBracket) // Update caret position after removing brackets
            setShowAddEdgeModal(true)
          }
        }
      }
    } catch (e) {
      console.error("An error occurred:", e)
    }
  }, [handleEditorChange, markdownContent])

  const generateMarkdownLinks = (selectedNodes: Record<string, string>[]) => {
    const markdownLinks = selectedNodes
      .map(
        ({ targetNodeId, name }) =>
          `[${name}](${generateNewNodeURL(targetNodeId)})`
      )
      .join(" ")

    if (caretPosition !== null) {
      const textBeforeCaret = markdownContent.substring(0, caretPosition)
      const textAfterCaret = markdownContent.substring(caretPosition)
      const newText = `${textBeforeCaret}${markdownLinks}${textAfterCaret}`

      handleEditorChange(newText)
      setCaretPosition(caretPosition + markdownLinks.length)
    } else {
      const newText = `${markdownContent}\n${markdownLinks}`
      handleEditorChange(newText)
    }
  }
  const handleFABClick = () => {
    // Set the cursor position to the end of the content
    const endPosition = markdownContent.length
    console.log("End position:", endPosition)
    setCursorPosition(endPosition) // Update cursor position state

    // Open the AddEdgeModal
    setShowAddEdgeModal(true)
    console.log("content", markdownContent)
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <Typography>
              <div ref={titleRef} onClick={toggleTitleEdit}>
                {isTitleEditable ? (
                  <Input
                    value={editableTitle}
                    onChange={onTitleChange}
                    onKeyDown={onTitleKeyDown}
                    autoFocus
                    style={headerStyle}
                  />
                ) : (
                  <h1 style={headerStyle}>{editableTitle}</h1>
                )}
              </div>
              {isEditing ? (
                <Input.TextArea
                  style={inputStyle}
                  ref={textAreaRef}
                  autoSize={{ minRows: 30 }}
                  value={markdownContent}
                  autoFocus
                  onChange={(e) => handleEditorChangeWithCheck(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                />
              ) : (
                <div>
                  {markdownContent.length > 1 ? (
                    markdownContent.split("\n").map((line, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div
                          onClick={() => handleLineClick(index)}
                          role="button"
                          tabIndex={0}
                        >
                          <Markdown>{line}</Markdown>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{ height: "50vh", cursor: "pointer" }}
                      onClick={() => setIsEditing(true)}
                    >
                      Click to start editing.
                    </div>
                  )}
                </div>
              )}
              <AddEdgeModal
                isOpen={showAddEdgeModal}
                onClose={() => setShowAddEdgeModal(false)}
                graphId={graphId}
                nodeId={nodeId}
                onConfirm={generateMarkdownLinks}
              />
              <Button
                type="primary"
                shape="circle"
                size="large"
                style={{
                  position: "absolute",
                  right: "20px",
                  bottom: "70px",
                  zIndex: 1000,
                }}
                onClick={handleFABClick}
              >
                {"[ ]"}
              </Button>

              <Drawer
                title="Context Menu"
                placement="bottom"
                onClose={handleCloseDrawer}
                open={showDrawer}
                height={200}
              >
                {/* Your context menu content here */}
              </Drawer>
            </Typography>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentTab
