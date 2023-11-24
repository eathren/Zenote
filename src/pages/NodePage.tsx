import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { notification } from "antd"
import { debounce } from "lodash"

import { GraphNode } from "src/types"
import { fetchMarkdown, uploadMarkdown } from "src/handles/markdown"
import { fetchNode, updateNodeTitle } from "src/handles/nodes"
import LoadingSpinner from "src/components/LoadingSpinner"
import PageBlock from "src/components/Blocks/PageBlock"
import Block from "src/components/Blocks"

const NodePage: React.FC = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentNode, setCurrentNode] = useState<GraphNode | null>(null)

  // useEffect(() => {
  //   setIsLoading(true)
  //   setMarkdownContent("")
  //   setCurrentNode(null)

  //   if (!nodeId || !graphId) return

  //   // Asynchronously fetch markdown content and node information
  //   const fetchMarkdownAsync = async () => {
  //     const md = await fetchMarkdown(nodeId)
  //     if (md) setMarkdownContent(md)
  //   }

  //   const fetchNodeAsync = async () => {
  //     const node = await fetchNode(graphId, nodeId)
  //     if (node) setCurrentNode(node)
  //   }

  //   // Execute both asynchronous operations and update state
  //   Promise.all([fetchMarkdownAsync(), fetchNodeAsync()])
  //     .then(() => {
  //       setIsLoading(false)
  //     })
  //     .catch((error) => {
  //       notification.error({
  //         message: "Fetching Failed",
  //         description: `An error occurred while fetching data: ${error}`,
  //       })
  //       setIsLoading(false)
  //     })
  // }, [graphId, nodeId])

  // const debounceUpload = useCallback(
  //   debounce((newValue: string) => {
  //     if (nodeId && newValue) {
  //       console.log("uploading")
  //       uploadMarkdown(nodeId, newValue)
  //     }
  //   }, 1500),
  //   [nodeId]
  // )

  // const handleEditorChange = (newValue?: string | undefined) => {
  //   if (newValue !== undefined) {
  //     setMarkdownContent(newValue)
  //     debounceUpload(newValue)
  //   }
  // }

  // const handleTitleChange = debounce((newTitle: string) => {
  //   if (graphId && nodeId && newTitle) {
  //     updateNodeTitle(graphId, nodeId, newTitle)
  //   }
  // }, 400)

  if (isLoading) return <LoadingSpinner />
  return (
    <>
      <PageBlock nodeId={nodeId} />
    </>
  )
}

export default NodePage
