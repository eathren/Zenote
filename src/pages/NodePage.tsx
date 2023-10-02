import { useState, useEffect } from "react"
import Markdown from "react-markdown"
import { useParams } from "react-router-dom"
import { fetchMarkdown } from "src/handles"

const NodePage = () => {
  const { nodeId } = useParams<{ nodeId: string }>()
  const [markdownContent, setMarkdownContent] = useState("")

  // Simulated Markdown fetching, replace this with real data fetch
  useEffect(() => {
    if (!nodeId) return
    const fetchMarkdownAsync = async (nodeId: string) => {
      const md = await fetchMarkdown(nodeId)
      if (md) setMarkdownContent(md)
    }
    fetchMarkdownAsync(nodeId)
  }, [nodeId])

  return (
    <div>
      <Markdown>{markdownContent}</Markdown>
    </div>
  )
}

export default NodePage
