import React, { useState } from "react"
import { Typography, Input } from "antd"
import { Block } from "src/types/blocks"

type Props = {
  block: Block
}

const TextBlock = (props: Props) => {
  const [editableText, setEditableText] = useState(
    props.block.properties.content
  )
  const [isEditing, setIsEditing] = useState(true)

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableText(e.target.value)
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing)
  }

  return (
    <div onClick={toggleEditMode}>
      {isEditing ? (
        <Input
          value={editableText}
          onChange={handleTextChange}
          onBlur={toggleEditMode}
          autoFocus
          style={{
            border: "none",
            outline: "none",
            width: "100%",
          }}
        />
      ) : (
        <Typography>{editableText}</Typography>
      )}
    </div>
  )
}

export default TextBlock
