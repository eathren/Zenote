import { PlusCircleOutlined } from "@ant-design/icons"
import { Button, Modal, Input, InputRef } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addGraphInDB } from "src/handles/graphs"
import { GraphPrivacySetting } from "src/types"

type AddGraphButtonProps = {
  type: GraphPrivacySetting
  children?: React.ReactNode
}

const AddGraphButton = (props: AddGraphButtonProps) => {
  const { type } = props
  const [modalOpen, setModalOpen] = useState(false)
  const [graphName, setGraphName] = useState("")
  const navigate = useNavigate()
  const inputRef = useRef<InputRef>(null)
  // Handle changes in the graph name input
  const handleGraphNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphName(e.target.value)
  }

  useEffect(() => {
    if (modalOpen) {
      inputRef.current?.focus()
    }
  }, [modalOpen])

  // Function to create a new graph
  const createGraph = async () => {
    if (type === GraphPrivacySetting.Private) {
      await addGraphInDB(graphName).then((docId) => {
        if (docId) {
          navigate(`/graphs/${docId}`)
        }
      })
    } else if (type === GraphPrivacySetting.Team) {
      // await addTeamGraphInDB(graphName, "test-team").then((docId) => {
      //   if (docId) {
      //     navigate(`/graphs/${docId}`)
      //   }
      // })
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
        icon={<PlusCircleOutlined />}
        type="text"
        onClick={() => setModalOpen(true)}
      >
        {props.children}
      </Button>
      <Modal
        title="Create a new graph"
        centered
        open={modalOpen}
        onOk={createGraph}
        onCancel={() => setModalOpen(false)}
      >
        <Input
          ref={inputRef}
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
