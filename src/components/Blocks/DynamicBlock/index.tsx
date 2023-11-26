import { Block, BlockType } from "src/types/blocks"
import TextBlock from "../TextBlock"
import TodoBlock from "../TodoBlock"

interface BlockRendererProps {
  block?: Block
  // Add other props like `updateBlock` for handling updates
}

const DynamicBlock: React.FC<BlockRendererProps> = ({ block }) => {
  const renderBlock = (block: Block | undefined) => {
    if (!block) return null
    switch (block.type) {
      case BlockType.Text:
        return <TextBlock block={block} />
      case BlockType.ToDo:
        return <TodoBlock block={block} />
      // Handle other block types
      default:
        return <div>Unsupported block type</div>
    }
  }

  // A function to fetch child blocks, assuming a function `fetchBlockById`
  //   const getChildBlocks = () => {
  //     return block.content.map((id) => fetchBlockById(id)) // Replace with your fetching logic
  //   }

  //   const childBlocks = getChildBlocks()

  return (
    <div>
      {renderBlock(block)}
      <div>
        {/* {childBlocks.map((childBlock) => (
          <BlockRenderer key={childBlock.id} block={childBlock} />
        ))} */}
      </div>
    </div>
  )
}

export default DynamicBlock
