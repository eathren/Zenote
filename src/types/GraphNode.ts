export type InitialGraphNode = Omit<GraphNode, "children">

export interface GraphNode {
  // Required Properties
  id: string
  content: string
  children: GraphNode[]
  date_created: number
  date_modified?: number

  // Optional Properties
  parent?: string
  expanded?: boolean
  color?: string
  completed?: false
}
