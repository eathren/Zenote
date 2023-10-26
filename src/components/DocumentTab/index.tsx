import React, { useState, useEffect, useRef } from "react"
import { Spin, Input, Drawer, Typography } from "antd"
import Markdown from "react-markdown"
import NodeHeader from "src/components/UI/Headers/NodeHeader"
import { useParams } from "react-router-dom"
import AddEdgeModal from "../AddEdgeModal"

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
  const [caretPosition, setCaretPosition] = useState<number | null>(null) // New state variable for the caret position

  const [prevMarkdownContent, setPrevMarkdownContent] =
    useState(markdownContent)

  const handleEditorChangeWithCheck = (newValue: string | undefined) => {
    if (newValue !== prevMarkdownContent) {
      handleEditorChange(newValue)
      setPrevMarkdownContent(newValue || "")
    }
  }

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

  const onTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsTitleEditable(false)
      handleTitleChange(editableTitle)
    }
  }

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

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

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
            console.log(`Before: ${markdownContent}`)
            console.log(`After: ${newContent}`)

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
          `[${name}](${
            import.meta.env.VITE_APP_DOMAIN
          }/graphs/${graphId}/node/${targetNodeId})`
      )
      .join(" ")

    if (caretPosition !== null) {
      const textBeforeCaret = markdownContent.substring(0, caretPosition)
      const textAfterCaret = markdownContent.substring(caretPosition)
      const newText = `${textBeforeCaret}${markdownLinks}${textAfterCaret}`

      handleEditorChange(newText)
      setCaretPosition(caretPosition + markdownLinks.length) // Update caret position after inserting the link
    }
  }
  // const [edgesUpdated, setEdgesUpdated] = useState(false)
  // const debouncedUpdate = debounce(
  //   async (oldContent: string, newContent: string) => {
  //     const extractNodeIds = (content: string) => {
  //       const regex = /\[.*?\]\(.*?\/node\/(.*?)\)/g
  //       const matches = []
  //       let match
  //       while ((match = regex.exec(content)) !== null) {
  //         matches.push(match[1])
  //       }
  //       return matches
  //     }

  //     const oldNodeIds = extractNodeIds(oldContent)
  //     const newNodeIds = extractNodeIds(newContent)
  //     const edgesToRemove = oldNodeIds.filter((id) => !newNodeIds.includes(id))

  //     if (edgesToRemove.length > 0) {
  //       await batchUpdateNodeEdges(graphId, nodeId, [], edgesToRemove)
  //       setEdgesUpdated(true)
  //     }
  //   },
  //   800
  // )

  // useEffect(() => {
  //   if (!edgesUpdated) {
  //     debouncedUpdate(prevMarkdownContent, markdownContent)
  //   }
  //   setEdgesUpdated(false)
  //   setPrevMarkdownContent(markdownContent)
  // }, [markdownContent, debouncedUpdate])
  return (
    <div>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <>
          <Typography>
            <NodeHeader
              editMode={isEditing}
              editableTitle={editableTitle}
              onTitleChange={onTitleChange}
              toggleEditMode={toggleEditMode}
            />
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
                style={commonStyle}
                ref={textAreaRef}
                autoSize={{ minRows: 10 }}
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
        </>
      )}
    </div>
  )
}

export default DocumentTab
