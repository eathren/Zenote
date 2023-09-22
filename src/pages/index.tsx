import { useNoteStore } from "src/stores/noteStore"
import TreeView from "src/components/Tree"

export const HomePage = () => {
  const { notes } = useNoteStore()
  return (
    <>
      <TreeView notes={notes} />
    </>
  )
}
