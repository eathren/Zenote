import { Button, Modal, Input } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addGraphInDB } from "src/handles"

const AddGraphButton = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [graphName, setGraphName] = useState("")
  const navigate = useNavigate()

  // Handle changes in the graph name input
  const handleGraphNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphName(e.target.value)
  }

  // Function to create a new graph
  const createGraph = () => {
    addGraphInDB(graphName).then((docId) => {
      if (docId) {
        navigate(`/graphs/${docId}`)
      }
    })
    setModalOpen(false)
    setGraphName("")
  }

  // Handle the onKeyDown event for the input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createGraph()
    }
  }

  return (
    <div>
      <Button onClick={() => setModalOpen(true)}>Add Graph</Button>
      <Modal
        title="Create a new graph"
        centered
        open={modalOpen}
        onOk={createGraph}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          placeholder="Graph Name..."
          value={graphName}
          onChange={handleGraphNameChange}
          onKeyDown={handleKeyDown} // Added onKeyDown handler
        />
      </Modal>
    </div>
  )
}

export default AddGraphButton
