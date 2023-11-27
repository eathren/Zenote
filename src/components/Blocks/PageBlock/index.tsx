import React, { useState, useEffect, useCallback } from "react"
import { Block, BlockType } from "src/types/blocks"
import { createBlock, deleteBlock, updateBlock } from "src/handles/blocks"
import { Input, Button } from "antd"
import { debounce } from "lodash"

interface PageBlockProps {
  graphId: string
  nodeId: string
  initialBlocks: Block[]
}

const PageBlock: React.FC<PageBlockProps> = ({
  graphId,
  nodeId,
  initialBlocks,
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  // Debounced function to update block
  const debouncedUpdateBlock = useCallback(
    debounce(async (blockId: string, newTitle: string) => {
      await updateBlock(graphId, nodeId, blockId, newTitle)
    }, 500),
    [graphId, nodeId]
  )
  const handleChange = (blockId: string, newTitle: string) => {
    // Update local state immediately for a responsive UI
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId
        ? { ...block, properties: { ...block.properties, title: newTitle } }
        : block
    )
    setBlocks(updatedBlocks)

    // Debounced update to backend
    debouncedUpdateBlock(blockId, newTitle)
  }

  const createNewBlock = async () => {
    const newBlockId = await createBlock(
      graphId,
      nodeId,
      BlockType.Text,
      nodeId
    )
    if (!newBlockId) return

    const newBlock: Block = {
      id: newBlockId,
      type: BlockType.Text,
      content: [],
      properties: {},
      parent: nodeId,
    }

    setBlocks([...blocks, newBlock])
  }

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault()
      await createNewBlock()
    }
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => {
    if (event.key === "Backspace" && event.currentTarget.value === "") {
      event.preventDefault()
      await deleteExistingBlock(blockId)
    }
  }

  const deleteExistingBlock = async (blockId: string) => {
    const updatedBlocks = blocks.filter((block) => block.id !== blockId)
    setBlocks(updatedBlocks) // Optimistic deletion

    await deleteBlock(graphId, nodeId, blockId)
    // Handle any error or reconciliation needed after backend operation
  }

  return (
    <div>
      {!blocks.filter((block) => block.id !== nodeId).length && (
        <Button onClick={createNewBlock}>Add Block</Button>
      )}
      {blocks
        .filter((block) => block.id !== nodeId)
        .map((block) => (
          <Input
            key={block.id}
            value={block.properties.title || ""}
            onPressEnter={handleKeyPress}
            onChange={(e) => handleChange(block.id, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, block.id)}
          />
        ))}
    </div>
  )
}

export default PageBlock
