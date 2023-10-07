import { useState, useEffect, useRef } from "react"
import Markdown from "react-markdown"
import { useParams } from "react-router-dom"
import {
  addEdge,
  fetchMarkdown,
  updateNodeTitle,
  uploadMarkdown,
} from "src/handles"
import MDEditor from "@uiw/react-md-editor"
import { EditOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { debounce } from "lodash"
import { useEdges } from "src/hooks/useEdges"
import { findNodeId } from "src/utils"
import { useNodes } from "src/hooks/useNodes"

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const editorRef = useRef<HTMLDivElement | null>(null)

  const { edges } = useEdges(graphId)
  const { nodes } = useNodes(graphId)

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str
  }

  const debouncedUpload = debounce(() => {
    if (nodeId && markdownContent) {
      uploadMarkdown(nodeId, markdownContent)
    }
  }, 500)

  useEffect(() => {
    debouncedUpload()
  }, [markdownContent])

  useEffect(() => {
    if (!nodeId) return
    const fetchMarkdownAsync = async (nodeId: string) => {
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
    }
    fetchMarkdownAsync(nodeId)
  }, [nodeId])

  useEffect(() => {
    const regex = /\[\[([^\]]+)\]\]/g
    let match
    const foundMatches: string[] = []

    while ((match = regex.exec(markdownContent)) !== null) {
      foundMatches.push(match[1])
    }

    const addNewEdges = async () => {
      for (const newEdge of foundMatches) {
        const targetId = findNodeId(nodes, newEdge)
        if (graphId && nodeId && targetId) {
          await addEdge(graphId, nodeId, targetId)
        }
      }
    }

    addNewEdges()
  }, [markdownContent, edges, nodes, nodeId, graphId])

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

  useEffect(() => {
    // Remove Markdown-specific characters like '#', '*', '_', etc.
    const cleanString = markdownContent
      .split("\n")[0]
      .replace(/[*_#`~]/g, "")
      .trim()

    // Truncate to 50 characters
    const truncatedTitle = truncate(cleanString, 50)

    if (nodeId) {
      updateNodeTitle(nodeId, truncatedTitle)
    }
  }, [markdownContent, nodeId])

  // Add event listener for clicks outside the editor
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue)
    }
  }

  return (
    <div style={{ color: "white" }}>
      <Button icon={<EditOutlined />} />
      <div ref={editorRef} onClick={handleClickInside}>
        {isEditing ? (
          <MDEditor
            data-color-mode="dark"
            value={markdownContent}
            onChange={handleEditorChange}
          />
        ) : (
          <Markdown>{markdownContent}</Markdown>
        )}
      </div>
    </div>
  )
}

export default NodePage
