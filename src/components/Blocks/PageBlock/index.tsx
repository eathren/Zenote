import { useState } from "react"
import { Block } from "src/types/blocks"

type Props = {
  nodeId: Block
}

const PageBlock = (props: Props) => {
  const [page, setPage] = useState<Block | null>(null)

  return <></>
}

export default PageBlock
