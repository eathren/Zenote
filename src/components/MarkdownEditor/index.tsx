import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Spin, Typography, Button, Drawer } from "antd"
import { debounce } from "lodash"
import EditorArea from "src/components/Editor"
import { fetchMarkdown, uploadMarkdown } from "src/handles/markdown"
import { updateNodeTitle } from "src/handles/nodes"

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useState<boolean>(false) // New state for showing or hiding the sidebar

  // const { nodes } = useNodes(graphId)

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str
  }

  // Fetch markdown content
  useEffect(() => {
    if (!nodeId || !graphId) return
    const fetchMarkdownAsync = async (nodeId: string) => {
      setIsLoading(true)
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
      setIsLoading(false)
    }
    fetchMarkdownAsync(nodeId)
  }, [graphId, nodeId])

  // Update the title of the node
  useEffect(() => {
    if (!nodeId || !graphId) return

    const cleanString = markdownContent
      .split("\n")[0]
      .replace(/[*_#`~]/g, "")
      .trim()
    const truncatedTitle = truncate(cleanString, 50)
    if (nodeId) {
      updateNodeTitle(graphId, nodeId, truncatedTitle)
    }
  }, [graphId, markdownContent, nodeId])

  // Debounce the upload operation
  const debounceUpload = useCallback(
    debounce((newValue: string) => {
      if (nodeId && newValue) {
        console.log("uploading")
        uploadMarkdown(nodeId, newValue)
      }
    }, 1500),
    []
  )

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue)
      debounceUpload(newValue)
    }
  }

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div>
      <Typography>
        <Button onClick={toggleSidebar}>Toggle Sidebar</Button>{" "}
        {/* New Button to toggle sidebar */}
        {isLoading ? (
          <Spin
            style={{ position: "absolute", left: "50%", top: "50%" }}
          ></Spin>
        ) : (
          <EditorArea
            markdownContent={markdownContent}
            handleEditorChange={handleEditorChange}
          />
        )}
      </Typography>
      {/* Sidebar Drawer */}
      <Drawer
        title="Node Details"
        placement="right"
        closable={true}
        onClose={toggleSidebar}
        open={showSidebar}
      >
        {/* Your tags, edges, and other metadata can go here */}
      </Drawer>
    </div>
  )
}

export default NodePage
