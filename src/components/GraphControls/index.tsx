import { useState } from "react"
import {
  Slider,
  Switch,
  Collapse,
  Button,
  Input,
  Drawer,
  Row,
  ColorPicker,
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

  const handleCreateGroup = () => {
    updateSetting(graphId, "groups", [
      ...(settings.groups || []),
      { name: "", color: "#FFFFFF" },
    ])
  }

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
            <Row justify={"space-between"}>
              <label>Show Orphans: </label>
              <Switch
                checked={settings.showOrphans}
                onChange={(checked) =>
                  updateSetting(graphId, "showOrphans", checked)
                }
              />
            </Row>
            <Row justify={"space-between"}>
              {" "}
              {/* Added showTags row */}
              <label>Show Tags: </label>
              <Switch
                checked={settings.showTags}
                onChange={(checked) =>
                  updateSetting(graphId, "showTags", checked)
                }
              />
            </Row>
          </Panel>
          <Panel header="Groups " key="2">
            {settings?.groups?.map((group, idx) => (
              <Row justify={"space-between"}>
                <Input
                  value={group?.name}
                  placeholder="Query"
                  style={{ width: "70%" }}
                  onChange={(e) => {
                    const newName = e.target.value
                    const newGroups = [...(settings.groups || [])]
                    newGroups[idx].name = newName
                    updateSetting(graphId, "groups", newGroups)
                  }}
                />
                <ColorPicker
                  value={group?.color}
                  defaultFormat="hex"
                  format="hex"
                  onChange={(color) => {
                    const newGroups = [...(settings.groups || [])]
                    newGroups[idx].color = color.toHexString()
                    updateSetting(graphId, "groups", newGroups)
                  }}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    const newGroups = [...(settings.groups || [])]
                    newGroups.splice(idx, 1)
                    updateSetting(graphId, "groups", newGroups)
                  }}
                />
              </Row>
            ))}
            <Button block onClick={handleCreateGroup}>
              New Group
            </Button>
            {/* <Input placeholder="Group Name" /> */}
            {/* <div>
              <label>Group Color: </label>
            
            </div> */}
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
            <label>Node Size: </label>
            <Slider
              min={1}
              max={20}
              value={settings.nodeSize}
              onChange={(value) => updateSetting(graphId, "nodeSize", value)}
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
      />
    </>
  )
}
export default GraphControls
