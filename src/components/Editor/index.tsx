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
  const [isEditing, setIsEditing] = useState(false)
  const [cursorPosition, setCursorPosition] = useState<number | null>(null)
  const textAreaRef = useRef<any>(null) // Change this to any
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (isEditing && textAreaRef.current && cursorPosition !== null) {
      const textArea: HTMLTextAreaElement =
        textAreaRef.current.resizableTextArea.textArea
      textArea.focus()
      textArea.setSelectionRange(cursorPosition, cursorPosition)
    }
  }, [isEditing, cursorPosition])

  const handleLineClick = (lineIndex: number) => {
    if (lineRefs.current[lineIndex]) {
      const linesBeforeClicked = markdownContent
        .split("\n")
        .slice(0, lineIndex)
        .join("\n")

      setCursorPosition(linesBeforeClicked.length + lineIndex) // Adding lineIndex for newlines
      setIsEditing(true)
    }
  }

  return (
    <div>
      {isEditing ? (
        <TextArea
          ref={textAreaRef}
          autoSize={{ minRows: 10 }}
          value={markdownContent}
          onChange={(e) => {
            handleEditorChange(e.target.value)
          }}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <div>
          {markdownContent.split("\n").map((line, index) => (
            <div
              ref={(el) => (lineRefs.current[index] = el)}
              key={index}
              onClick={() => handleLineClick(index)}
            >
              <Markdown>{line}</Markdown>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EditorArea
