import NodeControls from "../../NodeControls"
import BasicHeader from "./BasicHeader"
import { Input, Row, Col } from "antd"
import { GraphNode } from "src/types"
import { useCallback, useState } from "react"
import { debounce } from "lodash"
import { updateNodeTitle } from "src/handles/nodes"
import { useParams } from "react-router-dom"

type NodeHeaderProps = {
  node: GraphNode
}

const commonStyle = {
  border: "none",
  outline: "none",
  fontFamily: "inherit",
}

const NodeHeader = (props: NodeHeaderProps) => {
  const { node } = props
  const { graphId } = useParams<{ graphId: string }>()
  const [editableTitle, setEditableTitle] = useState(node.name)

  const debouncedUpdateTitle = useCallback(
    debounce((newTitle) => updateNodeTitle(graphId, node.id, newTitle), 500), // 500ms delay
    []
  )

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!graphId || !node.id) return
    const newTitle = e.target.value
    setEditableTitle(newTitle)
    debouncedUpdateTitle(newTitle)
  }

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
            {/* <Button
              onClick={() => props.toggleEditMode()}
              icon={props.editMode ? <EditOutlined /> : <BookOutlined />}
              style={{ marginRight: "10px" }}
            /> */}
            <NodeControls />
          </Col>
        </Row>
      </BasicHeader>
    </>
  )
}

export default NodeHeader
