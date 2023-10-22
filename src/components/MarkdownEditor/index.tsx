import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Spin, Typography } from "antd"
import { debounce } from "lodash"
import EditorArea from "src/components/Editor"
import { fetchMarkdown, uploadMarkdown } from "src/handles/markdown"
import { updateNodeTitle } from "src/handles/nodes"

const NodePage = () => {
  const { graphId, nodeId } = useParams<{ nodeId: string; graphId: string }>()
  const [markdownContent, setMarkdownContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  return (
    <div>
      <Typography>
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
    </div>
  )
}

export default NodePage
