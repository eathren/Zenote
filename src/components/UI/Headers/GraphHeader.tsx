import NodeMenu from "../../NodeMenu"
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
          style={{ width: "100%" }}
        >
          <Col md={2} sm={4} xs={4}>
            <NodeMenu />
          </Col>
          <Col md={10} sm={8} xs={10} style={{ maxWidth: "100%" }}>
            <Typography style={{ textAlign: "center" }}> {title} </Typography>
          </Col>
          <Col>
            <GraphControls />
          </Col>
        </Row>
      </BasicHeader>
    </>
  )
}

export default GraphHeader
