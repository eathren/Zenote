import { Note } from "./Note"

export interface TreeNode extends Note {
  children?: TreeNode[]
  expanded?: boolean
  index: number
}
