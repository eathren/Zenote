export interface Note {
  id: string
  timestamp?: number
  content: string
  parent?: string
  completed?: false
}
