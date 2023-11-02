import NodeMenu from "../../NodeMenu"
import GraphControls from "../../GraphControls"
import BasicHeader from "./BasicHeader"
import { useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { findGraph } from "src/utils"
import useGraphs from "src/hooks/useGraphs"
import { debounce } from "lodash"
import { updateGraphTitle } from "src/handles/graphs" // Make sure to implement this function
import { Col, Input, Row } from "antd"
import { Graph } from "src/types"

const commonStyle = {
  border: "none",
  outline: "none",
  fontFamily: "inherit",
}

const GraphHeader = () => {
  const { graphId } = useParams<{ graphId: string }>()
  const { graphs } = useGraphs()
  const [graph, setGraph] = useState<Graph | null>(null)
  const [title, setTitle] = useState<string>("")

  useEffect(() => {
    const foundGraph = findGraph(graphs, graphId)
    if (!foundGraph) return
    setGraph(foundGraph)
    setTitle(foundGraph.name)
  }, [graphId, graphs])

  const debouncedUpdateTitle = useCallback(
    debounce((newTitle) => {
      if (graphId && newTitle) {
        updateGraphTitle(graphId, newTitle)
      }
    }, 400),
    [graphId]
  )

  const handleTitleChange = (e: { target: { value: any } }) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedUpdateTitle(newTitle)
  }

  if (!graphId || !graph) return <></>
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
              value={title}
              onChange={handleTitleChange}
              style={{
                ...commonStyle,
                maxWidth: "100%",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "center",
              }}
            />
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
