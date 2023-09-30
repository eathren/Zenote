import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { addEmptyNodeInDB } from "src/handles"

export const AddButton = () => {
  return (
    <>
      <Button
        shape="circle"
        icon={<PlusOutlined />}
        onClick={() => addEmptyNodeInDB()}
      />
    </>
  )
}
