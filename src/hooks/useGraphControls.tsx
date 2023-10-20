import { useState } from "react"
import { Slider, Switch, Collapse, Button, Input, Tag, ColorPicker } from "antd"
import {
  SettingOutlined,
  CloseOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import type { Color } from "antd/es/color-picker"
const { Panel } = Collapse

const useGraphControls = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeKeys, setActiveKeys] = useState<string[]>(["1", "2", "3", "4"])
  const [nodeSize, setNodeSize] = useState<any>(5)
  const [linkStrength, setLinkStrength] = useState<number>(100)
  const [nodeStrength, setNodeStrength] = useState<number>(-30)
  const [repelForce, setRepelForce] = useState<number>(100)
  const [nodeGrowth, setNodeGrowth] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>("")
  const [color, setColor] = useState<Color | string>("#000000")
  const [lineThickness, setLineThickness] = useState<number>(1)

  const resetToDefaults = () => {
    setNodeSize(5)
    setLinkStrength(100)
    setNodeStrength(-30)
    setRepelForce(100)
    setNodeGrowth(true)
    setSearchText("")
    setColor("#000000")
    setLineThickness(1)
  }

  const GraphControls = () => (
    <>
      {menuOpen ? (
        <div style={{ position: "absolute", right: 0, top: "10%" }}>
          <div style={{ marginBottom: "20px", textAlign: "right" }}>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={resetToDefaults}
            />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMenuOpen(false)}
            />
          </div>
          <Collapse
            defaultActiveKey={["1", "2", "3", "4"]}
            activeKey={activeKeys}
            onChange={(keys: any) => setActiveKeys(keys)}
          >
            <Panel header="Filters" key="1">
              <Input
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
              />
              <Tag color="blue">Orphans</Tag>
            </Panel>
            <Panel header="Group Tabs" key="2">
              <Button>New Group</Button>
              <Input placeholder="Group Name" />
              <div>
                <label>Group Color: </label>
                <ColorPicker value={color} onChange={setColor} />
              </div>
            </Panel>
            <Panel header="Display" key="3">
              <label>Line Thickness: </label>
              <Slider
                min={1}
                max={10}
                value={lineThickness}
                onChange={(value) => setLineThickness(value as number)}
              />
            </Panel>
            <Panel header="Forces" key="4">
              <label>Node Growth: </label>
              <br />
              <Switch
                checked={nodeGrowth}
                onChange={() => setNodeGrowth(!nodeGrowth)}
              />
              <br />
              <label>Node Size: </label>
              <Slider
                min={1}
                max={20}
                value={nodeSize}
                onChange={setNodeSize}
              />
              <label>Link Strength: </label>
              <Slider
                min={0}
                max={200}
                step={1}
                value={linkStrength}
                onChange={(value) => setLinkStrength(value as number)}
              />
              <label>Node Strength: </label>
              <Slider
                min={-100}
                max={100}
                value={nodeStrength}
                onChange={(value) => setNodeStrength(value as number)}
              />
              <label>Repel Force: </label>
              <Slider
                min={0}
                max={200}
                value={repelForce}
                onChange={(value) => setRepelForce(value as number)}
              />
            </Panel>
          </Collapse>
        </div>
      ) : (
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={() => setMenuOpen(true)}
          style={{ position: "absolute", right: 0, top: "10%" }}
        />
      )}
    </>
  )

  return {
    nodeSize,
    linkStrength,
    nodeStrength,
    repelForce,
    nodeGrowth,
    searchText,
    color,
    lineThickness,
    GraphControls,
  }
}

export default useGraphControls
