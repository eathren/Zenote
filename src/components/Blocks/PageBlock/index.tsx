import React, { useState, useEffect, useCallback, useRef } from "react"
import { Block, BlockType } from "src/types/blocks"
import {
  createBlock,
  deleteBlock,
  updateBlock,
  updateParentBlockContent,
} from "src/handles/blocks"
import { Button, Typography } from "antd"
import { debounce } from "lodash"
import TextareaAutosize from "react-textarea-autosize"
import { v4 as uuidv4 } from "uuid"
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
      const id = uuidv4()

      // Optimistic UI update
      // const newBlock: Block = {
      //   id: id,
      //   type: BlockType.Text,
      //   content: [],
      //   properties: {},
      //   parent: nodeId,
      // }

      // const updatedBlocks = [...blocks]
      // updatedBlocks.splice(index + 1, 0, newBlock)
      // setBlocks(updatedBlocks)

      const createBlockPromise = createBlock(
        graphId,
        nodeId,
        id,
        BlockType.Text,
        nodeId,
        index + 1
      )
      const updateParentBlockPromise = updateParentBlockContent(
        graphId,
        nodeId,
        nodeId,
        id,
        index + 1
      )

      // Execute both operations concurrently
      await Promise.all([createBlockPromise, updateParentBlockPromise])

      // const updatedBlocks = [...blocks]
      // updatedBlocks.splice(index + 1, 0, newBlock)
      // setBlocks(updatedBlocks)

      // Focus on the new input field after state update

      // Perform Firestore updates

      // Update the parent block's content array
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
      deleteBlock(graphId, nodeId, blockId)
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
    event: React.KeyboardEvent<HTMLTextAreaElement>,
    blockId: string,
    index: number
  ) => {
    if (event.key === "Enter") {
      console.log("enter")
      event.preventDefault()
      await createNewBlockOptimistically(index)
    } else if (event.key === "Backspace" && event.currentTarget.value === "") {
      event.preventDefault()
      await handleDeleteBlockOptimistically(blockId, index)
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (event.key === "ArrowDown") {
        inputRefs.current[index + 1]?.focus()
      } else if (event.key === "ArrowUp") {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  return (
    <div>
      {blocks.length < 2 && (
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
