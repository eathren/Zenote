import React, { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"

// Define TypeScript prop types
type MarkdownEditorProps = {
  isEditing: boolean
  markdownContent: string
  handleEditorChange: (newValue?: string | undefined) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  isEditing,
  markdownContent,
  handleEditorChange,
}) => {
  // Initialize state to manage the currently focused line
  const [focusedLine, setFocusedLine] = useState<number | null>(null)

  // Use markdownContent from props
  const lines = markdownContent ? markdownContent.split("\n") : []

  // Handler for changes in the textarea
  const handleLineChange = (lineNumber: number, newContent: string) => {
    const newLines = [...lines]
    newLines[lineNumber] = newContent
    const updatedContent = newLines.join("\n")
    handleEditorChange(updatedContent)
  }

  // Update local state when markdownContent changes
  useEffect(() => {
    handleEditorChange(markdownContent)
  }, [markdownContent, handleEditorChange])

  return (
    <div className="markdown-editor">
      {/* Iterate over each line and render either a textarea or markdown */}
      {lines.map((line, index) => (
        <div key={index}>
          {isEditing && focusedLine === index ? (
            <textarea
              value={line}
              onFocus={() => setFocusedLine(index)}
              onBlur={() => setFocusedLine(null)}
              onChange={(e) => handleLineChange(index, e.target.value)}
            />
          ) : (
            <div onFocus={() => setFocusedLine(index)}>
              <ReactMarkdown>{line}</ReactMarkdown>
            </div>
          )}
        </div>
      ))}

      {/* Add new line button (only if in editing mode) */}
      {isEditing && (
        <button
          onClick={() => {
            handleEditorChange(markdownContent + "\n")
          }}
        >
          Add New Line
        </button>
      )}
    </div>
  )
}

export default MarkdownEditor
