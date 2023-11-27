import React, { useState, useEffect, useCallback } from "react"
import { debounce } from "lodash"
import { Block } from "src/types/blocks"
import { Input } from "antd"
import { updateBlock } from "src/handles/blocks"

interface TextBlockProps {
  block: Block
  graphId: string
  nodeId: string
  addBlockAfter?: () => void
  deleteBlock?: () => void
}

const TextBlock: React.FC<TextBlockProps> = ({
  block,
  graphId,
  nodeId,
  addBlockAfter,
  deleteBlock,
}) => {
  const [content, setContent] = useState<string>(block.content.join(", ")) // Assuming content is an array of strings
  console.log(block)
  // Debounced function to update the block in Firebase
  const debouncedUpdate = useCallback(
    debounce(async (newContent: string) => {
      await updateBlock(graphId, nodeId, block.id, newContent)
    }, 500),
    [block.id, graphId, nodeId]
  ) // 500 ms debounce time

  useEffect(() => {
    debouncedUpdate(content)
  }, [content, debouncedUpdate])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  return <Input type="text" value={content} onChange={handleChange} />
}

export default TextBlock
