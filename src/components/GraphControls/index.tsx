import { useState } from "react"
import {
  Slider,
  Switch,
  Collapse,
  Button,
  Input,
  ColorPicker,
  Tag,
  Drawer,
} from "antd"
import {
  EllipsisOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { useGraphSettingsStore } from "src/stores/graphSettingsStore"
import { useParams } from "react-router-dom"
const { Panel } = Collapse
const GraphControls = () => {
  const { graphId } = useParams()
  const [open, setOpen] = useState(false)
  // TODO, fix this undefined string
  const settings =
    useGraphSettingsStore((state) => state.settings[graphId!]) || {}
  const updateSetting = useGraphSettingsStore((state) => state.updateSetting)
  const resetToDefaults = useGraphSettingsStore(
    (state) => state.resetToDefaults
  )

  return (
    <>
      <Drawer
        title="Graph Controls"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={300}
        closeIcon={<CloseOutlined />}
      >
        <div style={{ textAlign: "right" }}></div>
        <Collapse
          defaultActiveKey={[]}
          bordered={false}
          onChange={(keys) => updateSetting(graphId, "activeKeys", keys)}
        >
          <Panel header="Filters" key="1">
            <Input
              prefix={<SearchOutlined />}
              value={settings.searchText}
              onChange={(e) =>
                updateSetting(graphId, "searchText", e.target.value)
              }
              placeholder="Search"
            />
            <Tag color="blue">Orphans</Tag>
          </Panel>
          <Panel header="Group Tabs" key="2">
            <Button>New Group</Button>
            <Input placeholder="Group Name" />
            <div>
              <label>Group Color: </label>
              <ColorPicker
                value={settings.color}
                onChange={(color) => updateSetting(graphId, "color", color)}
              />
            </div>
          </Panel>
          <Panel header="Display" key="3">
            <label>Line Thickness: </label>
            <Slider
              min={1}
              max={10}
              value={settings.lineThickness}
              onChange={(value) =>
                updateSetting(graphId, "lineThickness", value)
              }
            />
          </Panel>
          <Panel header="Forces" key="4">
            <label>Node Growth: </label>
            <br />
            <Switch
              checked={settings.nodeGrowth}
              onChange={(checked) =>
                updateSetting(graphId, "nodeGrowth", checked)
              }
            />
            <br />
            <label>Node Size: </label>
            <Slider
              min={1}
              max={20}
              value={settings.nodeSize}
              onChange={(value) => updateSetting(graphId, "nodeSize", value)}
            />
            <label>Link Strength: </label>
            <Slider
              min={0}
              max={200}
              value={settings.linkStrength}
              onChange={(value) =>
                updateSetting(graphId, "linkStrength", value)
              }
            />
            <label>Node Strength: </label>
            <Slider
              min={-100}
              max={100}
              value={settings.nodeStrength}
              onChange={(value) =>
                updateSetting(graphId, "nodeStrength", value)
              }
            />
            <label>Repel Force: </label>
            <Slider
              min={0}
              max={200}
              value={settings.repelForce}
              onChange={(value) => updateSetting(graphId, "repelForce", value)}
            />
          </Panel>
          <Panel header="Reset " key="5">
            <Button
              onClick={() => {
                resetToDefaults(graphId)
              }}
              icon={<ReloadOutlined />}
            >
              Reset to Defaults
            </Button>
          </Panel>
        </Collapse>
      </Drawer>

      <Button
        type="text"
        icon={<EllipsisOutlined />}
        onClick={() => setOpen(true)}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
    </>
  )
}
export default GraphControls
