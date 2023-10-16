import React, { useState, useEffect, useRef } from "react"
import { Spin, Input } from "antd"
import Markdown from "react-markdown"

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

  return (
    <div>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
      ) : (
        <>
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
                  <div key={index} onClick={() => handleLineClick(index)}>
                    <Markdown>{line}</Markdown>
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
        </>
      )}
    </div>
  )
}

export default DocumentTab
