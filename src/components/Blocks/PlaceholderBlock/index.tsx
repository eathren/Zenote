import { Input } from "antd"
import { useState } from "react"
import { Block } from "src/types/blocks"

type Props = {
  block: Block
}

const PlaceholderBlock = (props: Props) => {
  const [block, setBlock] = useState<Block | null>(null)
  return (
    <>
      <Input placeholder="'/' for commands..." />
    </>
  )
}

export default PlaceholderBlock
