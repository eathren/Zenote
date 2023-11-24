import { v4 as uuidv4 } from "uuid"
import { TextType, BlockType } from "src/types/blocks" // Assuming this is the path to your types

interface CreateTextBlockOptions {
  parent?: string
}

function createTextBlock(options: CreateTextBlockOptions = {}): Text {
  const { parent } = options

  return {
    id: uuidv4(),
    type: BlockType.Text,
    content: [""],
    property: {
      content: "",
    },
    parent: parent || "",
  }
}

export default createTextBlock
