import { useGraphs } from "src/stores/graphStore"
import { Graph } from "src/types"
import { Card } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./GraphSelector.module.css"

const GraphSelector = () => {
  const graphs = useGraphs()
  const navigate = useNavigate()

  return (
    <>
      {graphs.map((graph: Graph) => {
        return (
          <Card
            className={styles.card__body}
            key={graph.id}
            bordered={true}
            onClick={() => navigate(`/${graph.id}`)}
            hoverable={true}
          >
            {graph.name}
          </Card>
        )
      })}
    </>
  )
}

export default GraphSelector
