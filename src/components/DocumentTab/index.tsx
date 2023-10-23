import React, { useState, useEffect, useRef } from "react"
import { Spin, Input, Drawer } from "antd"
import Markdown from "react-markdown"
import NodeHeader from "src/components/UI/Headers/NodeHeader"

type DocumentTabProps = {
  markdownContent: string
  isLoading: boolean
  nodeTitle: string
  handleEditorChange: (newValue?: string | undefined) => void
  handleTitleChange: (newTitle: string) => void
}

const DocumentTab: React.FC<DocumentTabProps> = ({
  markdownContent,
  isLoading,
  nodeTitle,
  handleEditorChange,
  handleTitleChange,
}) => {
  const [editableTitle, setEditableTitle] = useState<string>(nodeTitle || "")
  const [isTitleEditable, setIsTitleEditable] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const [isEditing, setIsEditing] = useState(true)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<any>(null)

  const [showDrawer, setShowDrawer] = useState(false)

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

  return (
    <div>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <>
          <NodeHeader
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
              onChange={(e) => handleEditorChange(e.target.value)}
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
