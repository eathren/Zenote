import NodeControls from "../../NodeControls"
import BasicHeader from "./BasicHeader"
import { Button, Input, Row, Col } from "antd"
import { EditOutlined, BookOutlined } from "@ant-design/icons"

type NodeHeaderProps = {
  editableTitle: string | undefined
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  toggleEditMode: () => void
  editMode: boolean
}

const commonStyle = {
  border: "none",
  outline: "none",
  fontFamily: "inherit",
}

const NodeHeader = (props: NodeHeaderProps) => {
  const { editableTitle, onTitleChange } = props

  return (
    <>
      <BasicHeader>
        <Row
          justify="space-between"
          align="middle"
          gutter={16}
          style={{ width: "100%", display: "flex" }}
        >
          <Col flex={1} style={{ display: "flex", justifyContent: "center" }}>
            <Input
              value={editableTitle}
              onChange={onTitleChange}
              style={{
                ...commonStyle,
                maxWidth: "100%",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />
          </Col>
          <Col style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => props.toggleEditMode()}
              icon={props.editMode ? <EditOutlined /> : <BookOutlined />}
            />
            <NodeControls />
          </Col>
        </Row>
      </BasicHeader>
    </>
  )
}

export default NodeHeader
