export enum BlockType {
  Text = "Text",
  ToDo = "ToDo",
  Heading = "Heading",
  Table = "Table",
  // ... add other block types as needed
}

export interface Block {
  id: string // UUIDv4
  type: BlockType
  content: string[] // Array of string IDs
  properties: Record<string, any>
  parent?: string // UUIDV4
}

export interface ToDoType extends Block {
  properties: {
    title: string
    checked: boolean
  }
}

export interface TextType extends Block {
  properties: {
    content: string
  }
}
