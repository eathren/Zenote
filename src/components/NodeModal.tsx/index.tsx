import React from "react"
import { Modal, Input } from "antd"

type NodeModalProps = {
  open: boolean
  onOk: () => void
  onCancel: () => void
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

const NodeModal: React.FC<NodeModalProps> = ({
  open,
  onOk,
  onCancel,
  value,
  onChange,
  onKeyDown,
}) => {
  return (
    <Modal title="Add a new node" open={open} onOk={onOk} onCancel={onCancel}>
      <Input
        placeholder="Node Name..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </Modal>
  )
}

export default NodeModal
