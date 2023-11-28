import React, { useState, useEffect, useCallback, useRef } from "react"
import { Block, BlockType } from "src/types/blocks"
import { createBlock, deleteBlock, updateBlock } from "src/handles/blocks"
import { Button, Typography } from "antd"
import { debounce } from "lodash"
import TextareaAutosize from "react-textarea-autosize"
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
  const inputRefs = useRef<(HTMLTextAreaElement | null)[]>([])

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const debouncedUpdateBlock = useCallback(
    debounce(
      async (blockId: string, newTitle: string, previousBlocks: Block[]) => {
        try {
          await updateBlock(graphId, nodeId, blockId, newTitle)
        } catch (error) {
          // Revert to previous state in case of error
          setBlocks(previousBlocks)
          console.error("Failed to update block:", error)
        }
      },
      500
    ),
    [graphId, nodeId]
  )

  const handleChange = (blockId: string, newTitle: string) => {
    const previousBlocks = [...blocks]
    const updatedBlocks = blocks.map((block) =>
      block.id === blockId
        ? { ...block, properties: { ...block.properties, title: newTitle } }
        : block
    )
    setBlocks(updatedBlocks)

    // Fire off the debounced update with optimistic update
    debouncedUpdateBlock(blockId, newTitle, previousBlocks)
  }

  const createNewBlockOptimistically = async (index: number) => {
    const previousBlocks = [...blocks]
    try {
      const newBlockId = await createBlock(
        graphId,
        nodeId,
        BlockType.Text,
        nodeId
      )
      const newBlock: Block = {
        id: newBlockId,
        type: BlockType.Text,
        content: [],
        properties: {},
        parent: nodeId,
      }

      const updatedBlocks = [...blocks, newBlock]
      setBlocks(updatedBlocks)

      // Focus on the new input field after state update
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus()
      }, 0)
    } catch (error) {
      // Revert to previous state in case of error
      setBlocks(previousBlocks)
      console.error("Failed to create block:", error)
    }
  }

  const handleDeleteBlockOptimistically = async (
    blockId: string,
    index: number
  ) => {
    const previousBlocks = [...blocks]
    try {
      setBlocks(blocks.filter((block) => block.id !== blockId))
      await deleteBlock(graphId, nodeId, blockId)
      // Focus on the previous or next input field after deletion
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus()
      } else if (inputRefs.current[index]) {
        inputRefs.current[index]?.focus()
      }
    } catch (error) {
      // Revert to previous state in case of error
      setBlocks(previousBlocks)
      console.error("Failed to delete block:", error)
    }
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    blockId: string,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault()
      await createNewBlockOptimistically(index)
    } else if (event.key === "Backspace" && event.currentTarget.value === "") {
      event.preventDefault()
      await handleDeleteBlockOptimistically(blockId, index)
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // ... handle arrow keys
    }
  }

  return (
    <div>
      {!blocks.length && (
        <Button onClick={() => createNewBlockOptimistically(-1)}>
          Add Block
        </Button>
      )}
      <Typography>
        {blocks
          .filter((block) => block.id !== nodeId)
          .map((block, index) => (
            <TextareaAutosize
              key={block.id}
              ref={(el) => (inputRefs.current[index] = el)}
              value={block.properties.title || ""}
              onChange={(e) => handleChange(block.id, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, block.id, index)}
              style={{
                width: "100%",
                outline: "none",
                border: "none",
                backgroundColor: "transparent",
                color: "inherit",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "none",
              }}
              // Add other necessary props
            />
          ))}
      </Typography>
    </div>
  )
}

export default PageBlock
