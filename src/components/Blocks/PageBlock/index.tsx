import { useState, useEffect } from "react"
import { Block, BlockType } from "src/types/blocks"
import { createBlock } from "src/handles/blocks"
import { Input } from "antd"

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

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    blockId: string
  ) => {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement
      if (target.selectionStart === target.value.length) {
        // Check if cursor is at the end
        event.preventDefault()
        await createRootBlock(blockId)
      }
    }
  }

  const createRootBlock = async (currentBlockId: string) => {
    const newBlockId = await createBlock(graphId, nodeId, BlockType.Text)
    if (!newBlockId) return

    const newBlock: Block = {
      id: newBlockId,
      type: BlockType.Text,
      content: [],
      properties: {},
      parent: nodeId,
    }

    const newBlocks = [...blocks]
    const currentIndex = blocks.findIndex(
      (block) => block.id === currentBlockId
    )
    newBlocks.splice(currentIndex + 1, 0, newBlock)
    setBlocks(newBlocks)
  }

  return (
    <div>
      {blocks.map((block) => (
        <Input
          key={block.id}
          value={block.properties.text}
          onPressEnter={(e) => handleKeyPress(e, block.id)}
        />
      ))}
    </div>
  )
}

export default PageBlock
