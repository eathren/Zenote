import NodeMenu from "../../NodeMenu"
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
          justify="space-between"
          align="middle"
          gutter={16}
          style={{ width: "100%" }}
        >
          <Col md={2} sm={4} xs={4}>
            <NodeMenu />
          </Col>
          <Col md={10} sm={8} xs={10} style={{ maxWidth: "100%" }}>
            <Input
              value={editableTitle}
              onChange={onTitleChange}
              style={{
                ...commonStyle,
                maxWidth: "100%",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />
          </Col>
          <Col md={12} sm={12} xs={10}>
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
