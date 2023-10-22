import { useState } from "react"
import { useGraphs } from "src/hooks/useGraphs"
import { Card, Row, Col, Skeleton, Input, Button } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./GraphSelector.module.css"
import { Graph } from "src/types"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"

const GraphSelector = () => {
  const { graphs, loading } = useGraphs()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortAsc, setSortAsc] = useState(true)

  if (loading) return <Skeleton active />

  const filteredGraphs = graphs?.filter((graph) =>
    graph.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const sortedGraphs = [...filteredGraphs].sort((a, b) =>
    sortAsc ? a.date_created - b.date_created : b.date_created - a.date_created
  )

  return (
    <>
      <Row gutter={[16, 16]}>
        <Input.Search
          placeholder="Search for graphs"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          icon={sortAsc ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          onClick={() => setSortAsc(!sortAsc)}
        />
      </Row>
      <Row gutter={[16, 16]}>
        {sortedGraphs?.map((graph: Graph) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={graph.id}>
            <Card
              className={styles.card__body}
              bordered={true}
              onClick={() => navigate(`/graphs/${graph.id}`)}
              hoverable={true}
            >
              {graph.name}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default GraphSelector
