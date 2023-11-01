import { Spin } from "antd"
import GraphSelector from "src/components/Graphs/GraphSelector"
import useGraphs from "src/hooks/useGraphs"

const HomePage = () => {
  const { loading } = useGraphs()
  if (loading)
    return <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />
  return (
    <>
      <GraphSelector />
    </>
  )
}

export default HomePage
