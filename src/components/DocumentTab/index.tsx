import React, { useState, useEffect, useRef } from "react"
import { Spin, Input } from "antd"
import EditorArea from "src/components/Editor"
import ReactMarkdown from "react-markdown"

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
  const [editableTitle, setEditableTitle] = useState<string>(nodeTitle)
  const [isTitleEditable, setIsTitleEditable] = useState<boolean>(false)
  const titleRef = useRef<HTMLDivElement | null>(null)

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

  const toggleTitleEdit = () => {
    setIsTitleEditable((prev) => !prev)
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
              />
            ) : (
              <ReactMarkdown>{`# ${nodeTitle}`}</ReactMarkdown>
            )}
          </div>
          <EditorArea
            markdownContent={markdownContent}
            handleEditorChange={handleEditorChange}
          />
        </>
      )}
    </div>
  )
}

export default DocumentTab
