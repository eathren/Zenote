import { Note } from "src/types/Note"
import { TreeNode } from "src/types/TreeNode"

export const createTree = (data: Note[]): TreeNode[] => {
  const tree: TreeNode[] = []
  const nodeMap: { [id: string]: TreeNode } = {}

  let rootIndex = 0
  data.forEach((item: Note) => {
    if (!item.parent) {
      const newNode: TreeNode = { ...item, children: [], index: rootIndex++ }
      tree.push(newNode)
      nodeMap[item.id] = newNode
    }
  })

  const addChildNodes = (node: TreeNode) => {
    let localIndex = 0
    data.forEach((item: Note) => {
      if (item.parent === node.id) {
        const childNode: TreeNode = {
          ...item,
          children: [],
          index: localIndex++,
        }
        node.children?.push(childNode)
        nodeMap[item.id] = childNode
        addChildNodes(childNode)
      }
    })
  }

  tree.forEach(addChildNodes)

  return tree
}
