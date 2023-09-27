import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useGraphStore } from "src/stores/graphStore"

export const AddButton = () => {
  const { addNode } = useGraphStore()

  return (
    <>
      <Button
        shape="circle"
        icon={<PlusOutlined />}
        onClick={() => addNode()}
      />
    </>
  )
}
