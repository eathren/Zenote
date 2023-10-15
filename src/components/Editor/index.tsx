import React, { useEffect, useRef, useState } from "react"
import Markdown from "react-markdown"
import { Input } from "antd"

const { TextArea } = Input

interface EditorAreaProps {
  markdownContent: string
  handleEditorChange: (newValue?: string | undefined) => void
}

const EditorArea: React.FC<EditorAreaProps> = ({
  markdownContent,
  handleEditorChange,
}) => {
  const [isEditing, setIsEditing] = useState(true)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<any>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isEditing && textAreaRef.current && cursorPosition !== null) {
      const textArea: HTMLTextAreaElement =
        textAreaRef.current.resizableTextArea.textArea
      textArea.focus()
      textArea.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [isEditing, cursorPosition])

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textAreaRef.current) {
      const textArea: HTMLTextAreaElement =
        textAreaRef.current.resizableTextArea.textArea
      textArea.focus()
    }
  }, [])

  const handlePlaceholderClick = () => {
    setIsEditing(true)
  }

  const handleLineClick = (lineIndex: number) => {
    if (lineRefs.current[lineIndex]) {
      const linesBeforeClicked = markdownContent
        .split("\n")
        .slice(0, lineIndex)
        .join("\n")

      setCursorPosition(linesBeforeClicked.length + lineIndex)
      setIsEditing(true)
    }
  }

  return (
    <div>
      {isEditing ? (
        <TextArea
          style={{
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            fontSize: "inherit",
          }}
          ref={textAreaRef}
          autoSize={{ minRows: 10 }}
          value={markdownContent}
          onChange={(e) => handleEditorChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <div>
          {markdownContent.length > 1 ? (
            markdownContent.split("\n").map((line, index) => (
              <div
                ref={(el) => (lineRefs.current[index] = el)}
                key={index}
                onClick={() => handleLineClick(index)}
              >
                <Markdown>{line}</Markdown>
              </div>
            ))
          ) : (
            <div
              style={{
                height: "50vh",
                cursor: "pointer",
              }}
              onClick={handlePlaceholderClick}
            >
              Click to start editing.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EditorArea
