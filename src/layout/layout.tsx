import { Header as CustomHeader } from "src/components/Header"
import { RadarChartOutlined, FileAddOutlined } from "@ant-design/icons"
import { Popover } from "antd"
import { Button, Layout, theme } from "antd"
import React from "react"
import styles from "./index.module.css"
import { matchPath } from "react-router-dom"
const { Header, Content, Sider } = Layout

type LayoutProps = {
  children: React.ReactNode
}

const ButtonList = [
  {
    icon: <FileAddOutlined />,
    text: "Add Node",
    onClick: null,
  },
  {
    icon: <RadarChartOutlined />,
    text: "Open Graph View",
    onClick: null,
  },
]

export const BasicLayout = ({ children }: LayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const isHome = matchPath(window.location.pathname, "/")
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header>
          <CustomHeader />
        </Header>
        <Layout>
          {isHome ? null : (
            <Sider width={50} style={{ background: colorBgContainer }}>
              {ButtonList.map((item, index) => {
                return (
                  <div key={index}>
                    <Popover placement="right" title={item.text}>
                      <Button
                        type="text"
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        {item.icon}
                      </Button>
                    </Popover>
                  </div>
                )
              })}
            </Sider>
          )}
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                marginTop: 24,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <div className={styles.layout__body}>{children}</div>
    </>
  )
}
