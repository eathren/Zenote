import { PlusCircleFilled } from "@ant-design/icons"
import { Button, Modal, Input } from "antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { addGraphInDB, addTeamGraphInDB } from "src/handles/graphs"
import { GraphPrivacySetting } from "src/types"

type AddGraphButtonProps = {
  type: GraphPrivacySetting
}

const AddGraphButton = (props: AddGraphButtonProps) => {
  const { type } = props
  const [modalOpen, setModalOpen] = useState(false)
  const [graphName, setGraphName] = useState("")
  const navigate = useNavigate()

  // Handle changes in the graph name input
  const handleGraphNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphName(e.target.value)
  }

  // Function to create a new graph
  const createGraph = async () => {
    if (type === GraphPrivacySetting.Private) {
      await addGraphInDB(graphName).then((docId) => {
        if (docId) {
          navigate(`/graphs/${docId}`)
        }
      })
    } else if (type === GraphPrivacySetting.Team) {
      await addTeamGraphInDB(graphName, "test-team").then((docId) => {
        if (docId) {
          navigate(`/graphs/${docId}`)
        }
      })
    }
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
      <Button
        icon={<PlusCircleFilled />}
        type="text"
        onClick={() => setModalOpen(true)}
      ></Button>
      <Modal
        title="Create a new graph"
        centered
        open={modalOpen}
        onOk={createGraph}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          autoFocus
          placeholder="Graph Name..."
          value={graphName}
          onChange={handleGraphNameChange}
          onKeyDown={handleKeyDown}
        />
      </Modal>
    </div>
  )
}

export default AddGraphButton
