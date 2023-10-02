import { useGraphs } from "src/hooks/graphs"
import { Card } from "antd"
import { useNavigate } from "react-router-dom"
import styles from "./GraphSelector.module.css"
import { GraphObj } from "src/types"

const GraphSelector = () => {
  const graphs = useGraphs()
  const navigate = useNavigate()

  return (
    <>
      {console.log(graphs)}
      {graphs?.graphs?.map((graph: GraphObj) => {
        return (
          <Card
            className={styles.card__body}
            key={graph.id}
            bordered={true}
            onClick={() => navigate(`/${graph.id}`)}
            hoverable={true}
          >
            {graph.data.name}
          </Card>
        )
      })}
    </>
  )
}

export default GraphSelector
