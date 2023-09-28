// SubPage.tsx
import React from "react"
import { useParams } from "react-router-dom"
import { TreeView } from "src/components/Tree"
import { useTree } from "src/hooks/useTree"
import { findSubtreeById } from "src/utils"

export const SubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { tree } = useTree()

  if (!id) return <></>
  const subTree = findSubtreeById(id, tree)

  if (!subTree) return <></>
  return (
    <div>
      <TreeView tree={subTree} />
    </div>
  )
}
