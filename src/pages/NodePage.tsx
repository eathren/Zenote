import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { notification, Tabs, TabsProps } from "antd"
import { debounce } from "lodash"
import {
  fetchMarkdown,
  fetchNode,
  updateNodeTitle,
  uploadMarkdown,
  addEdgeToNode,
} from "src/handles"
import { GraphNode } from "src/types"
import { useNodes } from "src/hooks/useNodes"
import DocumentTab from "src/components/DocumentTab"
import DataTab from "src/components/DataTab"

const NodePage: React.FC = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true) // set to true initially
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null)

  const { nodes } = useNodes(graphId)

  // const truncate = (str: string, length: number): string => {
  //   return str.length > length ? str.substring(0, length) + "..." : str
  // }

  useEffect(() => {
    if (!nodeId || !graphId) return

    const fetchMarkdownAsync = async () => {
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
    }

    const fetchNodeAsync = async () => {
      const node = await fetchNode(nodeId)
      if (node) setCurrentNode(node)
    }

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
  console.log(currentNode)

  const debounceUpload = useCallback(
    debounce((newValue: string) => {
      if (nodeId && newValue) {
        uploadMarkdown(nodeId, newValue)
      }
    }, 1500),
    [nodeId]
  )

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue)
      debounceUpload(newValue)
    }
  }

  const handleTitleChange = useCallback(
    debounce((newTitle: string) => {
      if (nodeId && newTitle) {
        updateNodeTitle(nodeId, newTitle)
      }
    }, 1500),
    [nodeId]
  )

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
          addEdgeToNode={addEdgeToNode}
        />
      ),
    },
  ]

  return <Tabs defaultActiveKey="1" items={items} />
}

export default NodePage
