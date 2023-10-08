import React, { useCallback, useState } from "react"
import { Header as CustomHeader } from "src/components/UI/Header"
import { RadarChartOutlined, FileAddOutlined } from "@ant-design/icons"
import { Popover, Button, Layout, Modal, Input, notification } from "antd"
import { matchPath, useParams } from "react-router-dom"
import { addNode } from "src/handles"
import { theme } from "antd"
import { useNodes } from "src/hooks/useNodes"
import { isNodeNameUnique } from "src/utils"

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
  const { nodes } = useNodes(graphId)

  const [modalOpen, setModalOpen] = useState(false)
  const [nodeName, setNodeName] = useState("")

  const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value)
  }

  const handleAddNode = useCallback(() => {
    setModalOpen(true)
  }, [])

  const confirmAddNode = () => {
    const unique = isNodeNameUnique(nodes, nodeName)
    if (unique) {
      if (graphId) addNode(graphId, nodeName)
      setModalOpen(false)
      setNodeName("")
    } else {
      notification.error({
        message: "Node Name Error",
        description:
          "This node name already exists. Please choose another name.",
      })
    }
  }

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

        {/* Modal for adding a new node */}
        <Modal
          title="Add a new node"
          visible={modalOpen}
          onOk={confirmAddNode}
          onCancel={() => setModalOpen(false)}
        >
          <Input
            placeholder="Node Name..."
            value={nodeName}
            onChange={handleNodeNameChange}
          />
        </Modal>
      </Layout>
    </>
  )
}
