import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { notification, Spin, Tabs, TabsProps } from "antd"
import { debounce } from "lodash"

import { GraphNode } from "src/types"
import { useNodes } from "src/hooks/useNodes"
import DocumentTab from "src/components/DocumentTab"
import DataTab from "src/components/DataTab"
import { fetchMarkdown, uploadMarkdown } from "src/handles/markdown"
import { fetchNode, updateNodeTitle } from "src/handles/nodes"

const NodePage: React.FC = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null)

  const { nodes } = useNodes(graphId)

  useEffect(() => {
    setIsLoading(true)
    setMarkdownContent("")
    setCurrentNode(null)

    if (!nodeId || !graphId) return

    // Asynchronously fetch markdown content and node information
    const fetchMarkdownAsync = async () => {
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
    }

    const fetchNodeAsync = async () => {
      const node = await fetchNode(graphId, nodeId)
      if (node) setCurrentNode(node)
    }

    // Execute both asynchronous operations and update state
    Promise.all([fetchMarkdownAsync(), fetchNodeAsync()])
      .then(() => {
        setIsLoading(false)
      })
      .catch((error) => {
        notification.error({
          message: "Fetching Failed",
          description: `An error occurred while fetching data: ${error}`,
        })
        setIsLoading(false)
      })
  }, [graphId, nodeId])

  const debounceUpload = debounce((newValue: string) => {
    if (nodeId && newValue) {
      uploadMarkdown(nodeId, newValue)
    }
  }, 1500)

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue)
      debounceUpload(newValue)
    }
  }

  const handleTitleChange = debounce((newTitle: string) => {
    if (graphId && nodeId && newTitle) {
      updateNodeTitle(graphId, nodeId, newTitle)
    }
  }, 400)

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Document",
      children: (
        <DocumentTab
          markdownContent={markdownContent}
          isLoading={isLoading}
          nodeTitle={currentNode ? currentNode.name : ""}
          handleEditorChange={handleEditorChange}
          handleTitleChange={handleTitleChange}
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
        />
      ),
    },
  ]

  return isLoading ? (
    <Spin style={{ position: "absolute", left: "50%", top: "50%" }} />
  ) : (
    <Tabs defaultActiveKey="1" items={items} />
  )
}

export default NodePage
