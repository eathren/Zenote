import { Button, Modal, Input } from "antd"
import { useState } from "react"
import { useGraphActions } from "src/stores/graphStore"
import { useNavigate } from "react-router-dom"
import { addGraphInDB } from "src/handles"

const AddGraphButton = () => {
  const { addGraph } = useGraphActions()
  const [modalOpen, setModalOpen] = useState(false)
  const [graphName, setGraphName] = useState("")
  const navigate = useNavigate()
  const handleGraphNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphName(e.target.value)
  }

  const createGraph = () => {
    addGraphInDB(graphName).then((docId) => {
      if (docId) {
        addGraph(docId)
        navigate(`/${docId}`)
      }
    })
    setModalOpen(false)
    setGraphName("")
  }

  return (
    <div>
      <Button onClick={() => setModalOpen(true)}>Add Graph</Button>
      <Modal
        title="Vertically centered modal dialog"
        centered
        open={modalOpen}
        onOk={createGraph}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          placeholder="Graph Name..."
          value={graphName}
          onChange={handleGraphNameChange}
        ></Input>
      </Modal>
    </div>
  )
}

export default AddGraphButton
