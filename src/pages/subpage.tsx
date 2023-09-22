// SubPage.tsx
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { updateSelectedTreeNodes, useTreeStore } from "src/stores/treeStore"
import TreeView from "src/components/Tree"
import { useNoteStore } from "src/stores/noteStore"

export const SubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { notes, fetchNotes } = useNoteStore()
  const { setSelectedParentId, selectedTreeNodes } = useTreeStore()

  useEffect(() => {
    if (!notes) {
      fetchNotes()
    }
  }, [fetchNotes, notes])

  useEffect(() => {
    if (id && notes) {
      setSelectedParentId(id)
      updateSelectedTreeNodes()
    }
  }, [id, notes, setSelectedParentId])

  return (
    <div>
      <TreeView notes={selectedTreeNodes} />
    </div>
  )
}
