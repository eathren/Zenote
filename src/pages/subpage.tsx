// SubPage.tsx
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { updateSelectedTreeNodes, useTreeStore } from "src/stores/treeStore"
import TreeView from "src/components/Tree"

export const SubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { setSelectedParentId, selectedTreeNodes } = useTreeStore()

  useEffect(() => {
    if (id) {
      setSelectedParentId(id)
      updateSelectedTreeNodes()
    }
  }, [id, setSelectedParentId])

  return (
    <div>
      <TreeView notes={selectedTreeNodes} />
    </div>
  )
}
