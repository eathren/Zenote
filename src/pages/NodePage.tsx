import { useState, useEffect, useRef } from "react"
import Markdown from "react-markdown"
import { useParams } from "react-router-dom"
import { fetchMarkdown } from "src/handles"
import MDEditor from "@uiw/react-md-editor"
import { EditOutlined } from "@ant-design/icons"
import { Button } from "antd"

const NodePage = () => {
  const { nodeId } = useParams<{ nodeId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const editorRef = useRef<HTMLDivElement | null>(null) // Ref for the editor container

  // Simulated Markdown fetching, replace this with real data fetch
  useEffect(() => {
    if (!nodeId) return
    const fetchMarkdownAsync = async (nodeId: string) => {
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
    }
    fetchMarkdownAsync(nodeId)
  }, [nodeId])

  // Handle clicks inside the editor
  const handleClickInside = () => {
    setIsEditing(true)
  }

  // Handle clicks outside the editor
  const handleClickOutside = (event: MouseEvent) => {
    if (
      editorRef.current &&
      !editorRef.current.contains(event.target as Node)
    ) {
      setIsEditing(false)
    }
  }

  // Add event listener for clicks outside the editor
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div style={{ color: "white" }}>
      <Button icon={<EditOutlined />} />
      <div ref={editorRef} onClick={handleClickInside}>
        {isEditing ? (
          <MDEditor
            data-color-mode="dark"
            value={markdownContent}
            onChange={setMarkdownContent}
          />
        ) : (
          <Markdown>{markdownContent}</Markdown>
        )}
      </div>
    </div>
  )
}

export default NodePage
