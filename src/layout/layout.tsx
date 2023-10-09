import React, { useCallback, useState } from "react";
import { Header as CustomHeader } from "src/components/UI/Header";
import {
  RadarChartOutlined,
  FileAddOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Popover, Button, Layout, Modal, Input, notification } from "antd";
import { matchPath, useParams } from "react-router-dom";
import { addNode } from "src/handles";
import { theme } from "antd";
import { useNodes } from "src/hooks/useNodes";
import { isNodeNameUnique } from "src/utils";
import styles from "./index.module.css";
import FooterButtonList from "src/components/FooterButtonList";
import { useForwardHistory } from "src/hooks/useForwardHistory";

const { Header, Content, Sider, Footer } = Layout;

type LayoutProps = {
  children: React.ReactNode;
};

export const BasicLayout = ({ children }: LayoutProps) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const isHome = matchPath(window.location.pathname, "/");
  const { graphId } = useParams<{ graphId?: string }>();
  const { nodes } = useNodes(graphId);

  const [modalOpen, setModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");

  const { hasForwardHistory } = useForwardHistory();

  const handleNodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  };

  const handleAddNode = useCallback(() => {
    setModalOpen(true);
  }, []);

  const confirmAddNode = () => {
    const unique = isNodeNameUnique(nodes, nodeName);
    if (unique) {
      if (graphId) addNode(graphId, nodeName);
      setModalOpen(false);
      setNodeName("");
    } else {
      notification.error({
        message: "Node Name Error",
        description:
          "This node name already exists. Please choose another name.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAddNode();
    }
  };

  const goBackInHistory = () => {
    window.history.back();
  };

  const goForwardInHistory = () => {
    window.history.forward();
  };

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
    {
      icon: <ArrowLeftOutlined />,
      text: "Go Back",
      onClick: goBackInHistory,
    },
    {
      icon: <ArrowRightOutlined />,
      text: "Go Forward",
      onClick: goForwardInHistory,
      disabled: !hasForwardHistory,
    },
  ];

  return (
    <>
      <Layout className={styles.layout__body}>
        <Header>
          <CustomHeader />
        </Header>
        <Layout>
          {isHome ? null : (
            <Sider className={styles.sidebar} width={50} style={{}}>
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
            <Footer className={styles.footer}>
              {isHome ? null : <FooterButtonList buttonList={ButtonList} />}
            </Footer>
          </Layout>
        </Layout>

        <Modal
          title="Add a new node"
          open={modalOpen}
          onOk={confirmAddNode}
          onCancel={() => setModalOpen(false)}
        >
          <Input
            placeholder="Node Name..."
            value={nodeName}
            onChange={handleNodeNameChange}
            onKeyDown={handleKeyDown}
          />
        </Modal>
      </Layout>
    </>
  );
};
