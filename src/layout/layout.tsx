import React, { useCallback, useState } from "react"
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

const { Content, Footer } = Layout

type LayoutProps = {
  children: React.ReactNode
}

export const BasicLayout = ({ children }: LayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const { user } = useUser()

  const { graphId } = useParams<{ graphId?: string }>()
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
        {!user && <CustomHeader />}
        <Layout className={styles.main__content}>
          <Layout>
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
