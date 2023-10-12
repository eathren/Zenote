import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
  addEdge,
  fetchMarkdown,
  updateNodeTitle,
  uploadMarkdown,
} from "src/handles"
import { Spin, Typography } from "antd"
import { debounce } from "lodash"
import { useEdges } from "src/hooks/useEdges"
import { findNodeId } from "src/utils"
import { useNodes } from "src/hooks/useNodes"
import EditorArea from "src/components/Editor"

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: edges } = useEdges(graphId)
  const { data: nodes } = useNodes(graphId)

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
    }, 1000),
    []
  )

  const handleEditorChange = (newValue?: string | undefined) => {
    if (newValue !== undefined) {
      setMarkdownContent(newValue)
      debounceUpload(newValue)
    }
  }

  return (
    <Typography>
      {isLoading ? (
        <Spin style={{ position: "absolute", left: "50%", top: "50%" }}></Spin>
      ) : (
        <EditorArea
          markdownContent={markdownContent}
          handleEditorChange={handleEditorChange}
        />
      )}
    </Typography>
  )
}

export default NodePage
