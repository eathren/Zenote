import React, { useState, useCallback, useMemo } from "react"
import {
  Tree,
  Input,
  Row,
  Drawer,
  Button,
  Space,
  Typography,
  Modal,
} from "antd"
import { useGraphs } from "src/hooks/useGraphs"
import { useNavigate } from "react-router-dom"
import {
  EllipsisOutlined,
  CopyOutlined,
  StarOutlined,
  DeleteOutlined,
  StarFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { Graph, GraphPrivacySetting } from "src/types"
import AddGraphButton from "../AddGraphButton"
import { deleteGraph, updateGraphFavoriteStatus } from "src/handles/graphs"

const GraphSelector = () => {
  const { graphs, loading } = useGraphs()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Graph | null>(null)

  const showDeleteConfirm = (graphId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this graph?",
      icon: <ExclamationCircleOutlined />,
      content: "Once deleted, this action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteGraph(graphId)
        // Delete logic here
      },
      onCancel() {
        console.log("Cancel")
      },
    })
  }

  const onSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      const key: string = selectedKeys[0] as string
      if (key.startsWith("graph-")) {
        const graphId = key.substring("graph-".length)
        navigate(`/graphs/${graphId}`)
      } else if (key.startsWith("node-")) {
        const nodeId = key.split("-")[1]
        const parentGraph = graphs?.find(
          (graph) => graph.nodes && Object.keys(graph.nodes).includes(nodeId)
        )
        if (parentGraph?.id) {
          navigate(`/graphs/${parentGraph.id}/node/${nodeId}`)
        }
      }
    },
    [graphs, navigate]
  )

  const filterGraphs = useCallback(
    (type: "private" | "team" | "favorites") => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      return graphs?.filter((graph) => {
        const graphNameMatches = graph.name
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
        const nodeMatches = Object.values(graph.nodes || {}).some((nodeName) =>
          nodeName.toLowerCase().includes(lowerCaseSearchTerm)
        )
        return graph.type === type && (graphNameMatches || nodeMatches)
      })
    },
    [graphs, searchTerm]
  )

  const buildTreeData = useCallback(
    (type: "private" | "team" | "favorites") => {
      return (
        filterGraphs(type)?.map((graph) => {
          const children = Object.entries(graph.nodes || {})
            .filter(
              ([, nodeName]) =>
                searchTerm === "" ||
                nodeName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(([nodeId, nodeName]) => ({
              title: nodeName,
              key: `node-${nodeId}-${nodeName}`,
              isLeaf: true,
            }))

          return {
            title: (
              <Space>
                {graph.name}
                <EllipsisOutlined
                  style={{ float: "right" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedNode(graph)
                    setDrawerVisible(true)
                  }}
                />
              </Space>
            ),
            key: `graph-${graph.id}`,
            children,
          }
        }) || []
      )
    },
    [filterGraphs, searchTerm]
  )

  const privateTreeData = useMemo(
    () => buildTreeData("private"),
    [buildTreeData]
  )
  const teamTreeData = useMemo(() => buildTreeData("team"), [buildTreeData])
  const favoriteTreeData = useMemo(
    () => buildTreeData("favorites"),
    [buildTreeData]
  )

  if (loading) return <span></span>

  return (
    <>
      <Typography style={{ paddingBottom: "100px" }}>
        <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
          <Input.Search
            placeholder="Search for graphs and nodes"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Row>
        <div>
          <Row gutter={[16, 16]} align={"middle"}>
            <Typography.Title style={{ margin: "0px 5px" }} level={4}>
              Private
            </Typography.Title>
            <AddGraphButton type={GraphPrivacySetting.Private} />
          </Row>
          <Tree showLine treeData={privateTreeData} onSelect={onSelect} />
        </div>
        <div>
          <Row gutter={[16, 16]} align={"middle"}>
            <Typography.Title style={{ margin: "0px 5px" }} level={4}>
              Teams
            </Typography.Title>
            <AddGraphButton type={GraphPrivacySetting.Team} />
          </Row>
          <Tree showLine treeData={teamTreeData} onSelect={onSelect} />
        </div>
        <div>
          <Row gutter={[16, 16]} align={"middle"}>
            <Typography.Title style={{ margin: "0px 5px" }} level={4}>
              Favorites
            </Typography.Title>
            <AddGraphButton type={GraphPrivacySetting.Team} />
          </Row>
          <Tree showLine treeData={favoriteTreeData} onSelect={onSelect} />
        </div>
      </Typography>
      <Drawer
        title={selectedNode?.name}
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        height={200}
      >
        <Button
          type="text"
          icon={<CopyOutlined />}
          onClick={() => {
            /* Copy Link logic */
          }}
        >
          Copy Link
        </Button>
        <Button
          type="text"
          icon={selectedNode?.isFavorite ? <StarFilled /> : <StarOutlined />}
          onClick={() => {
            updateGraphFavoriteStatus(selectedNode?.id)
          }}
        >
          {selectedNode?.isFavorite
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </Button>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            if (selectedNode?.id) {
              showDeleteConfirm(selectedNode.id)
            }
          }}
        >
          Delete
        </Button>
      </Drawer>
    </>
  )
}

export default GraphSelector
