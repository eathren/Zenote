import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
  fetchMarkdown,
  fetchNode,
  updateNodeTitle,
  uploadMarkdown,
  addEdgeToNode,
} from "src/handles"
import { Tabs, TabsProps } from "antd"
import { debounce } from "lodash"
import { GraphNode } from "src/types" // Assuming you have a GraphNode type definition
import { useNodes } from "src/hooks/useNodes"
import DocumentTab from "src/components/DocumentTab"
import DataTab from "src/components/DataTab"

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null)

  const { nodes } = useNodes(graphId)

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

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Document",
      children: (
        <DocumentTab
          markdownContent={markdownContent}
          isLoading={isLoading}
          handleEditorChange={handleEditorChange}
        />
      ),
    },
    {
      key: "2",
      label: "Data",
      children: (
        <DataTab
          currentNode={currentNode}
          nodes={nodes}
          graphId={graphId}
          nodeId={nodeId}
          addEdgeToNode={addEdgeToNode}
        />
      ),
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} />
}

export default NodePage
