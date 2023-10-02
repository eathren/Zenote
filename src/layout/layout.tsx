import React, { useCallback } from "react"
import { Header as CustomHeader } from "src/components/Header"
import { RadarChartOutlined, FileAddOutlined } from "@ant-design/icons"
import { Popover, Button, Layout } from "antd"
import { matchPath, useParams } from "react-router-dom"
import { addNode } from "src/handles"
import { theme } from "antd"

const { Header, Content, Sider } = Layout

type LayoutProps = {
  children: React.ReactNode
}

export const BasicLayout = ({ children }: LayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const isHome = matchPath(window.location.pathname, "/")
  const { graphId } = useParams<{ graphId?: string }>()
  // Define the function to handle adding a node
  const handleAddNode = useCallback(() => {
    if (graphId) addNode(graphId)
  }, [graphId])

  const ButtonList = [
    {
      icon: <FileAddOutlined />,
      text: "Add Node",
      onClick: handleAddNode,
    },
    {
      icon: <RadarChartOutlined />,
      text: "Open Graph View",
      onClick: handleAddNode,
    },
  ]

  return (
    <>
      <Layout style={{ height: "100vh" }}>
        <Header>
          <CustomHeader />
        </Header>
        <Layout>
          {isHome ? null : (
            <Sider width={50} style={{ background: colorBgContainer }}>
              {ButtonList.map((item, index) => (
                <div key={index}>
                  <Popover placement="right" title={item.text}>
                    <Button
                      type="text"
                      style={{ width: "100%", marginTop: "10px" }}
                      onClick={() => item.onClick()}
                    >
                      {item.icon}
                    </Button>
                  </Popover>
                </div>
              ))}
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
    </>
  )
}
