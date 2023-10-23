import { Layout } from "antd"
import { theme } from "antd"

import styles from "./index.module.css"

const { Header } = Layout

type HeaderProps = {
  children: React.ReactNode
}

const BasicHeader = (props: HeaderProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <>
      <Header
        style={{ background: colorBgContainer }}
        className={styles.header}
      >
        {props.children}
      </Header>
    </>
  )
}

export default BasicHeader
