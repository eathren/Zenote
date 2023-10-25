import React, { useState, useEffect, useRef } from "react"
import { Spin, Input, Drawer } from "antd"
import Markdown from "react-markdown"
import NodeHeader from "src/components/UI/Headers/NodeHeader"
import { useParams } from "react-router-dom"
import AddEdgeModal from "../AddEdgeModal"
import { useNodes } from "src/hooks/useNodes"
import { findNode } from "src/utils"
import { addTagToNode, removeTagFromNode } from "src/handles/nodes"
import { debounce } from "lodash"

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
  const [bracketCount, setBracketCount] = useState(0)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const [isEditing, setIsEditing] = useState(
    markdownContent.length > 0 ? false : true
  )
  const { nodes } = useNodes(graphId)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<any>(null)
  const [showAddEdgeModal, setShowAddEdgeModal] = useState<boolean>(false)
  const [showDrawer, setShowDrawer] = useState(false)
  // const [detectedNodeNames, setDetectedNodeNames] = useState<string[]>([])
  const [prevMarkdownContent, setPrevMarkdownContent] =
    useState(markdownContent)

  // const { edges, addEdge, deleteEdge } = useEdges(graphId, nodeId)
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

  // const handleContextMenuClick = (lineIndex: number) => {
  //   setSelectedLineIndex(lineIndex)
  //   setShowDrawer(true)
  // }

  const handleCloseDrawer = () => {
    setShowDrawer(false)
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  useEffect(() => {
    // Debounce function to delay the tag extraction
    const handleTagUpdate = async () => {
      const tagPattern = /#[a-zA-Z0-9_]+(?=\s|$)/g // Updated regex pattern to match tags only if followed by space or end of string
      const matches = markdownContent.match(tagPattern)
      const newDetectedTags = matches
        ? matches.map((m) => m.replace(/#/g, ""))
        : []

      if (!nodeId) return
      const n = findNode(nodes, nodeId)
      const existingTags = n?.tags ?? []

      // Add new tags
      const tagsToAdd = newDetectedTags.filter(
        (tag) => !existingTags.includes(tag)
      )
      tagsToAdd.forEach(async (newTag) => {
        await addTagToNode(graphId, nodeId, newTag)
      })

      // Remove old tags
      const tagsToRemove = existingTags.filter(
        (tag) => !newDetectedTags.includes(tag)
      )
      tagsToRemove.forEach(async (tagToRemove) => {
        await removeTagFromNode(graphId, nodeId, tagToRemove)
      })
    }

    const debouncedHandleTagUpdate = debounce(handleTagUpdate, 500)

    debouncedHandleTagUpdate()

    // Cleanup
    return () => {
      debouncedHandleTagUpdate.cancel()
    }
  }, [markdownContent, nodes, nodeId, graphId])

  // const debouncedBatchUpdate = debounce(async (markdownContent: string, ) => {
  //   const edgePattern = /\[\[(.*?)\]\]/g;
  //   const matches = markdownContent.match(edgePattern);
  //   const newDetectedNodeTargetIds = matches ? matches.map((m: string) => m.replace(/\[\[|\]\]/g, "")) : [];

  //   if (!nodeId) return;

  //   const n = findNode(nodes, nodeId);
  //   const existingEdges: GraphEdge[] = n?.edges ?? [];
  //   // Add new edges
  //   const edgesToAdd = newDetectedNodeTargetIds.filter(
  //     (nodeTargetId) => !existingEdges.some((existingEdge) => existingEdge.target === nodeTargetId)
  //   );

  //   // Remove old edges
  //   const edgesToRemove = existingEdges.filter(
  //     (existingEdge) => !newDetectedNodeTargetIds.includes(existingEdge.target as string)
  //   ).map((existingEdge) => existingEdge.target as string);

  //   if (edgesToAdd.length > 0 || edgesToRemove.length > 0) {
  //     await batchUpdateNodeEdges(graphId, nodeId, edgesToAdd, edgesToRemove);
  //   }
  // }, 500);

  // useEffect(() => {
  //   debouncedBatchUpdate(markdownContent)
  // }, [markdownContent, nodes, nodeId, graphId, debouncedBatchUpdate])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "[") {
      setBracketCount(bracketCount + 1)

      if (bracketCount === 1) {
        e.preventDefault()
        const value = markdownContent
        const start =
          textAreaRef.current.resizableTextArea.textArea.selectionStart
        const end = textAreaRef.current.resizableTextArea.textArea.selectionEnd

        const newValue = `${value.substring(0, start)}[[${value.substring(
          start,
          end
        )}]]${value.substring(end)}`

        handleEditorChange(newValue)
        setCursorPosition(start + 2)

        // Reset bracketCount
        setBracketCount(0)

        // Trigger the AddEdgeModal with the dropdown for node names
        setShowAddEdgeModal(true)
      }
    } else {
      setBracketCount(0)
    }
  }

  // useEffect(() => {
  //   const nodeNamePattern = /\[\[(.*?)\]\]/g
  //   const matches = markdownContent.match(nodeNamePattern)
  //   const newDetectedNodeNames = matches
  //     ? matches.map((m) => m.replace(/\[\[|\]\]/g, ""))
  //     : []

  //   if (!nodeId) return
  //   const n = findNode(nodes, nodeId)
  //   const edgeIds = n?.edges?.map((edge) => edge.target) ?? []
  //   const edgenames = edgeIds.map((edgeId) => {
  //     findNode(nodes, edgeId as string)?.name
  //   })

  //   newDetectedNodeNames.forEach(async (newNodeName) => {
  //     // if the node doesn't have an edge, create the edge
  //     // if it does and no longer finds the name, delete it
  //     if (!edgenames.includes(newNodeName)) {
  //       await addEdgeToNode(graphId, nodeId, targetNodeId)
  //     }
  //     if (edgenames.includes(newNodeName)) return
  //   })

  //   // Delete edges for removed node names
  // }, [markdownContent, nodes, edges, detectedNodeNames, nodeId, graphId])

  // const handleNodeNameClick = async (targetNodeName: string) => {
  //   const targetNodeId = findNodeId(nodes, targetNodeName)
  //   if (!targetNodeId || !graphId || !nodeId) return
  //   await addEdgeToNode(graphId, nodeId, targetNodeId)
  //   // Logic to create an edge between `nodeId` and `targetNodeId`
  //   // based on the `targetNodeName` clicked.
  // }

  return (
    <div>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <>
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
              onKeyDown={handleKeyPress}
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
        </>
      )}
    </div>
  )
}

export default DocumentTab
