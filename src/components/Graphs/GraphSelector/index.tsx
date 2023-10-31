import React, { useState, useCallback, useMemo } from "react"
import { Tree, Input, Row, Drawer, Button, Space, Typography } from "antd"
import { useGraphs } from "src/hooks/useGraphs"
import { useNavigate } from "react-router-dom"
import {
  EllipsisOutlined,
  CopyOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { Graph } from "src/types"

const GraphSelector = () => {
  const { graphs, loading } = useGraphs()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Graph | null>(null)

  const filterGraphs = useCallback(
    (type: "private" | "team" | "favorites") => {
      return graphs?.filter((graph) => {
        if (graph.type !== type) return false
        return (
          graph.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(graph.nodes || {}).some((nodeName) =>
            nodeName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      })
    },
    [graphs, searchTerm]
  )

  const buildTreeData = useCallback(
    (type: "private" | "team" | "favorites") => {
      return (
        filterGraphs(type)?.map((graph) => {
          const children = graph.nodes
            ? Object.entries(graph.nodes)
                .filter(([_, nodeName]) =>
                  nodeName.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(([nodeId, nodeName]) => {
                  return { title: nodeName, key: `node-${nodeId}` }
                })
            : []

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

  const onSelect = useCallback(
    (selectedKeys: React.Key[]) => {
      const key: string = selectedKeys[0] as string
      if (key.startsWith("graph-")) {
        const graphId = key.substring("graph-".length)
        navigate(`/graphs/${graphId}`)
      } else if (key.startsWith("node-")) {
        const nodeId = key.substring("node-".length)
        const parentGraph = graphs?.find(
          (graph) =>
            graph.nodes && Object.hasOwnProperty.call(graph.nodes, nodeId)
        )
        if (parentGraph?.id) {
          navigate(`/graphs/${parentGraph.id}/node/${nodeId}`)
        }
      }
    },
    [graphs, navigate]
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

  if (loading) return <span>Loading...</span>

  return (
    <>
      <Typography>
        <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
          <Input.Search
            placeholder="Search for graphs and nodes"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Row>
        <div>
          <Typography.Title level={4}>Private Graphs</Typography.Title>
          <Tree
            showLine
            defaultExpandAll
            treeData={privateTreeData}
            onSelect={onSelect}
          />
        </div>
        <div>
          <Typography.Title level={4}>Team Graphs</Typography.Title>
          <Tree
            showLine
            defaultExpandAll
            treeData={teamTreeData}
            onSelect={onSelect}
          />
        </div>
        <div>
          <Typography.Title level={4}>Favorite Graphs</Typography.Title>
          <Tree
            showLine
            defaultExpandAll
            treeData={favoriteTreeData}
            onSelect={onSelect}
          />
        </div>
      </Typography>
      <Drawer
        title={selectedNode?.name}
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
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
          icon={<StarOutlined />}
          onClick={() => {
            /* Add to Favorites logic */
          }}
        >
          Add to Favorites
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
