import { Card } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import useGraphs from "src/hooks/useGraphs"
import { GraphPrivacySetting } from "src/types"
import AddGraphButton from "src/components/Graphs/AddGraphButton"
import GraphSelector from "src/components/Graphs/GraphSelector"
import { useEffect, useState } from "react"

const HomePage = () => {
  const { graphs, loading } = useGraphs()
  const [isSiderVisible, setIsSiderVisible] = useState(false)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSiderVisible(window.innerWidth > 1200)
    }

    window.addEventListener("resize", checkScreenSize)
    checkScreenSize()

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])
  if (loading)
    return <Spin style={{ position: "absolute", top: "50%", left: "50%" }} />

  const hasNoGraphs = graphs.length === 0

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      {!loading && hasNoGraphs && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Card
            style={{ width: 300 }}
            cover={
              <div style={{ padding: "20px", textAlign: "center" }}>
                <PlusCircleOutlined
                  style={{ fontSize: "48px", color: "#1890ff" }}
                />
              </div>
            }
            actions={[
              <AddGraphButton type={GraphPrivacySetting.Private}>
                Create Private Graph
              </AddGraphButton>,
            ]}
          >
            <Card.Meta
              title="No Graphs Yet"
              description="Start by creating your first graph."
            />
          </Card>
        </div>
      )}
      {!isSiderVisible && <GraphSelector />}
    </div>
  )
}

export default HomePage
