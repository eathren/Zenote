import { useGraphs } from "src/hooks/useGraphs"
import { Card } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./GraphSelector.module.css"
import { Graph } from "src/types"
import { Skeleton } from "antd"

const GraphSelector = () => {
  const { graphs, loading } = useGraphs()
  const navigate = useNavigate()

  if (loading)
    return (
      <>
        <Skeleton active />;
      </>
    )

  return (
    <>
      {graphs?.map((graph: Graph) => {
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
