export enum BlockType {
  Text = "Text",
  ToDo = "ToDo",
  Heading = "Heading",
  Table = "Table",
  Page = "Page",
}

export interface Block {
  id: string // UUIDv4
  type: BlockType
  content: string[] // Array of string IDs
  properties: Record<string, any>
  parent?: string // UUIDV4
}
