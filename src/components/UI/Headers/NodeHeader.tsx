import NodeMenu from "../../NodeMenu"
import NodeControls from "../../NodeControls"
import BasicHeader from "./BasicHeader"
import { Button, Col, Input, Row, Typography } from "antd"
import { EditOutlined } from "@ant-design/icons"
import { useState } from "react"

type NodeHeaderProps = {
  editableTitle: string | undefined
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  toggleEditMode: () => void
}

const commonStyle = {
  border: "none",
  outline: "none",
  fontFamily: "inherit",
  fontWeight: 600,
  fontSize: "1.5rem",
}

const NodeHeader = (props: NodeHeaderProps) => {
  const [isTitleEditable, setIsTitleEditable] = useState<boolean>(false)
  const { editableTitle, onTitleChange, toggleEditMode } = props

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
          <Col md={10} sm={8} xs={10}>
            {isTitleEditable ? (
              <Input
                value={editableTitle}
                onChange={onTitleChange}
                autoFocus
                style={commonStyle}
              />
            ) : (
              <Typography.Title
                style={commonStyle}
                level={4}
                onClick={() => setIsTitleEditable(!isTitleEditable)}
              >
                {editableTitle}
              </Typography.Title>
            )}
          </Col>
          <Col md={12} sm={12} xs={10}>
            <Row justify="end" align="middle" gutter={16}>
              <Col>
                <Button onClick={toggleEditMode} icon={<EditOutlined />} />
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
