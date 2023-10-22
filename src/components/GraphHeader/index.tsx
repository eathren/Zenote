import { Layout } from "antd"
import { theme } from "antd"

import styles from "./index.module.css"
import NodeMenu from "../NodeMenu"
import GraphControls from "../GraphControls"

const { Header } = Layout

const GraphHeader = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <>
      <Header
        style={{ background: colorBgContainer }}
        className={styles.graph__header}
      >
        <NodeMenu />

        <GraphControls />
      </Header>
    </>
  )
}

export default GraphHeader
