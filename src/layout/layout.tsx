import React, { useCallback, useEffect, useState } from "react"
import {
  RadarChartOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import { Layout } from "antd"
import { useNavigate, useParams } from "react-router-dom"
import { theme } from "antd"
import styles from "./index.module.css"
import FooterButtonList from "src/components/FooterButtonList"
import { useForwardHistory } from "src/hooks/useForwardHistory"
import AddNodeModal from "src/components/AddNodeModal"
import { Header as CustomHeader } from "src/components/UI/NonAuth/Header"
import { useUser } from "src/hooks/user"
import GraphSelector from "src/components/Graphs/GraphSelector"

const { Content, Footer, Sider } = Layout

type LayoutProps = {
  children: React.ReactNode
}

export const BasicLayout = ({ children }: LayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { user, loading } = useUser()
  const [isSiderVisible, setIsSiderVisible] = useState(false)
  const { graphId } = useParams<{ graphId?: string }>()
  const [modalOpen, setModalOpen] = useState(false)
  const { hasForwardHistory } = useForwardHistory()
  const navigate = useNavigate()
  const [collapsed] = useState(false)
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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSiderVisible(window.innerWidth >= 1200) // Adjust the threshold as needed
    }

    window.addEventListener("resize", checkScreenSize)
    checkScreenSize() // Initial check

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const ButtonList = [
    {
      icon: <HomeOutlined />,
      text: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <FileTextOutlined />,
      text: "Find or Add New Node",
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
      <Layout
        className={styles.layout__body}
        style={{ background: colorBgContainer }}
      >
        {!user && !loading && <CustomHeader />}
        <Layout className={styles.main__content}>
          {isSiderVisible && user && (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              width={300}
              className={styles.sider}
              style={{
                background: colorBgContainer,
                overflow: "auto",
                padding: "20px",
              }}
            >
              <GraphSelector />
            </Sider>
          )}
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
            }}
          >
            {children}
          </Content>
        </Layout>
        {user && (
          <Footer className={styles.footer}>
            <FooterButtonList buttonList={ButtonList} />
          </Footer>
        )}
        <AddNodeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          graphId={graphId}
        />
      </Layout>
    </>
  )
}
