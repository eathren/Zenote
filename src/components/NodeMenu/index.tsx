import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button, Drawer, Input, Typography } from "antd"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useNodes } from "src/hooks/useNodes"

const NodeMenu = () => {
  const { graphId, nodeId } = useParams<{ graphId?: string; nodeId?: string }>()
  const { nodes } = useNodes(graphId)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredNodes, setFilteredNodes] = useState(nodes)

  useEffect(() => {
    if (nodes) {
      setFilteredNodes(
        nodes.filter((node) =>
          node.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [nodes, searchTerm])

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const items = filteredNodes
    ?.filter((node) => node.id !== undefined)
    .map((node) => (
      <Typography
        key={node.id}
        onClick={() => {
          navigate(`/graphs/${graphId}/node/${node.id}`)
          onClose()
        }}
        style={node.id === nodeId ? { fontWeight: "bold" } : {}}
      >
        {node.name}
      </Typography>
    ))

  return (
    <>
      <Drawer
        title={
          <Input.Search placeholder="Search nodes..." onChange={handleSearch} />
        }
        placement="left"
        onClose={onClose}
        open={open}
        closeIcon={<MenuUnfoldOutlined />}
      >
        <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
          {items}
        </div>
      </Drawer>
      <Button
        icon={open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        onClick={showDrawer}
        style={{ position: "absolute", top: 5, left: 5, zIndex: 201 }}
      />
    </>
  )
}

export default NodeMenu
