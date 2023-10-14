import React, { useCallback, useState } from "react"
import {
  RadarChartOutlined,
  FileAddOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import { Popover, Button, Layout } from "antd"
import { matchPath, useNavigate, useParams } from "react-router-dom"
import { theme } from "antd"
import { useNodes } from "src/hooks/useNodes"
import styles from "./index.module.css"
import FooterButtonList from "src/components/FooterButtonList"
import { useForwardHistory } from "src/hooks/useForwardHistory"
import AddNodeModal from "src/components/AddNodeModal"

const { Content, Sider, Footer } = Layout

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
  const { hasForwardHistory } = useForwardHistory()
  const navigate = useNavigate()

  const handleAddNode = useCallback(() => {
    setModalOpen(true)
  }, [])

  const goBackInHistory = () => {
    window.history.back()
  }

  const goForwardInHistory = () => {
    window.history.forward()
  }

  const handleNavigateGraphView = () => {
    navigate(`/graphs/${graphId}`)
  }

  const ButtonList = [
    {
      icon: <HomeOutlined />,
      text: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <FileAddOutlined />,
      text: "Add Node",
      onClick: handleAddNode,
    },
    {
      icon: <RadarChartOutlined />,
      text: "Open Graph View",
      onClick: handleNavigateGraphView,
    },
    {
      icon: <ArrowLeftOutlined />,
      text: "Go Back",
      onClick: goBackInHistory,
      disabled: false,
    },
    {
      icon: <ArrowRightOutlined />,
      text: "Go Forward",
      onClick: goForwardInHistory,
      disabled: !hasForwardHistory,
    },
    {
      icon: <SettingOutlined />,
      text: "Settings",
      onClick: () => navigate("/settings"),
    },
  ]

  return (
    <>
      <Layout className={styles.layout__body}>
        <Layout className={styles.main__content}>
          {isHome ? null : (
            <Sider className={styles.sidebar} width={45} style={{}}>
              {ButtonList.map((item, index) => (
                <div key={index}>
                  <Popover placement="right" title={item.text}>
                    <Button
                      type="text"
                      style={{ width: "100%", marginTop: "10px" }}
                      onClick={() => item.onClick()}
                      disabled={item.disabled}
                    >
                      {item.icon}
                    </Button>
                  </Popover>
                </div>
              ))}
            </Sider>
          )}
          <Layout style={{ padding: 0 }}>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
        <Footer className={styles.footer}>
          {isHome ? null : <FooterButtonList buttonList={ButtonList} />}
        </Footer>
        <AddNodeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          nodes={nodes}
          graphId={graphId}
        />
      </Layout>
    </>
  )
}
