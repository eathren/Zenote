import { BlockType } from "src/types/blocks"
import { v4 as uuidv4 } from "uuid"

// Function to create a new block
const createBlock = (type: BlockType, parent: string, properties = {}) => {
  return {
    id: uuidv4(),
    type,
    properties,
    content: [],
    parent,
  }
}

export default createBlock
