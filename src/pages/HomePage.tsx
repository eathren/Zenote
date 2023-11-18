import { Spin } from "antd"
import useGraphs from "src/hooks/useGraphs"

const HomePage = () => {
  const { loading } = useGraphs()
  if (loading)
    return <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />
  return <></>
}

export default HomePage
