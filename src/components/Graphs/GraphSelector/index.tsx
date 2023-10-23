import React, { useState } from "react"
import { Tree, Input, Row, Drawer, Button, Space, Modal } from "antd"
import { useGraphs } from "src/hooks/useGraphs"
import { useNavigate } from "react-router-dom"
import {
  EllipsisOutlined,
  CopyOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import { Graph } from "src/types"
import { deleteGraph } from "src/handles/graphs"

const GraphSelector: React.FC = () => {
  const { graphs, loading } = useGraphs()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Graph | null>(null)

  if (loading) return <span>Loading...</span>

  const filteredGraphs = graphs?.filter((graph) => {
    const matchesGraph = graph.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesNodes = Object.values(graph.nodes || {}).some((nodeName) =>
      nodeName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return matchesGraph || matchesNodes
  })

  const treeData = filteredGraphs
    ?.filter((graph) => graph.id !== undefined)
    .sort((graphA, graphB) => {
      return graphB.date_created - graphA.date_created
    })
    .map((graph) => ({
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
      key: `graph-${graph.id}` as string,
      children: graph.nodes
        ? Object.entries(graph.nodes)
            .filter(([nodeName]) =>
              nodeName.toLowerCase().includes(searchTerm.toLowerCase())
            )

            .map(([nodeId, nodeName]) => ({
              title: nodeName,
              key: `node-${nodeId}`,
            }))
        : [],
    }))

  const onSelect = (selectedKeys: React.Key[]) => {
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
  }

  const showDeleteConfirm = (graphId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this graph?",
      content: "Once deleted, the graph cannot be recovered.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteGraph(graphId)
      },
    })
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Input.Search
          placeholder="Search for graphs and nodes"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Row>
      <br />
      <Tree showLine={true} treeData={treeData} onSelect={onSelect} />
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
