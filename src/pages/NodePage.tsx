import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
  fetchMarkdown,
  fetchNode,
  updateNodeTitle,
  uploadMarkdown,
} from "src/handles"
import { Spin, Typography, Button, Drawer, Tabs } from "antd"
import { debounce } from "lodash"
import { GraphNode } from "src/types" // Assuming you have a GraphNode type definition
import { useNodes } from "src/hooks/useNodes"
import EditorArea from "src/components/Editor"

const { TabPane } = Tabs

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null)

  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + "..." : str
  }

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

  // New useEffect to fetch the node based on nodeId
  useEffect(() => {
    if (!nodeId) return
    const fetchNodeAsync = async () => {
      const node = await fetchNode(nodeId)
      if (node) setCurrentNode(node)
      console.log(node)
    }
    fetchNodeAsync()
  }, [nodeId])

  useEffect(() => {
    const cleanString = markdownContent
      .split("\n")[0]
      .replace(/[*_#`~]/g, "")
      .trim()
    const truncatedTitle = truncate(cleanString, 50)
    if (nodeId) {
      updateNodeTitle(nodeId, truncatedTitle)
    }
  }, [markdownContent, nodeId])

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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  return (
    <div>
      <Typography>
        <Button onClick={toggleSidebar}>Toggle Sidebar</Button>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Document" key="1">
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
          </TabPane>
          <TabPane tab="Data" key="2">
            {/* Here you can display the loaded node details if it exists */}
            {currentNode && (
              <div>
                {/* Display node details here */}
                <p>Node Title: {currentNode.name}</p>
                <p>Node ID: {currentNode.id}</p>
                <p> Edges: {currentNode.edges.map((edge) => edge.id)}</p>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Typography>
      <Drawer
        title="Node Details"
        placement="right"
        closable={true}
        onClose={toggleSidebar}
        open={showSidebar}
      >
        {/* Drawer contents */}
      </Drawer>
    </div>
  )
}

export default NodePage
