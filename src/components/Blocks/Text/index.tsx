import React from "react"
import { Typography } from "antd"
import { TextType } from "src/types/blocks"

type Props = {
  text: TextType
}

const Text: React.FC<Props> = ({ text }) => {
  return <Typography>{text.properties.content}</Typography>
}

export default Text
