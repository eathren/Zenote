import GraphControls from "../../GraphControls"
import BasicHeader from "./BasicHeader"
import { Col, Row, Typography } from "antd"

type GraphHeaderProps = {
  title: string | undefined
}

const GraphHeader = (props: GraphHeaderProps) => {
  const { title } = props

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
            <Typography style={{ textAlign: "center" }}>{title}</Typography>
          </Col>
          <Col style={{ display: "flex", justifyContent: "flex-end" }}>
            <GraphControls />
          </Col>
        </Row>
      </BasicHeader>
    </>
  )
}

export default GraphHeader
