import { Typography } from "antd"
import { useState } from "react"
import { Block } from "src/types/blocks"
import DynamicBlock from "src/components/Blocks/DynamicBlock"

type Props = {
  nodeId: string
  blocks: Block[]
}

const PageBlock = (props: Props) => {
  const [page, setPage] = useState<Block | null>(null)

  return (
    <Typography>
      <>
        {props.blocks.forEach((block) => (
          <DynamicBlock block={block} />
        ))}
      </>
    </Typography>
  )
}

export default PageBlock
