import NodeControls from "../../NodeControls"
import BasicHeader from "./BasicHeader"
import { Button, Col, Input, Row } from "antd"
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
          justify="space-around" // Updated this line
          align="middle"
          gutter={16}
          style={{ width: "100%" }}
        >
          <Col md={8} sm={6} xs={2}></Col> {/* Empty column for spacing */}
          <Col md={8} sm={12} xs={20}>
            <Input
              value={editableTitle}
              onChange={onTitleChange}
              style={{
                ...commonStyle,
                maxWidth: "100%",
                width: "100%",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />
          </Col>
          <Col md={8} sm={6} xs={2}>
            <Row justify="end" align="middle" gutter={16}>
              <Col>
                <Button
                  onClick={() => props.toggleEditMode()}
                  icon={props.editMode ? <EditOutlined /> : <BookOutlined />}
                />
              </Col>
              <Col>
                <NodeControls />
              </Col>
            </Row>
          </Col>
        </Row>
      </BasicHeader>
    </>
  )
}

export default NodeHeader
