export type Note = {
  id: string
  timestamp?: number
  content: string
  parent?: string
  expanded?: false
  completed?: false
}
