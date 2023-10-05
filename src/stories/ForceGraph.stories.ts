import ForceGraph from "src/components/ForceGraph"
import type { Meta, StoryObj } from "@storybook/react"
import { GraphEdge, GraphNode } from "src/types"
import { withRouter } from "storybook-addon-react-router-v6"

const meta: Meta<typeof ForceGraph> = {
  title: "Example/ForceGraph",
  component: ForceGraph,
  decorators: [withRouter],
  parameters: {},
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

const nodes: GraphNode[] = [
  {
    id: "1",
    graphId: "g1",
    name: "Node 1",
  },
  {
    id: "2",
    graphId: "g1",
    name: "Node 2",
  },
  {
    id: "3",
    graphId: "g1",
    name: "Node 3",
  },
  { id: "4", graphId: "g1", name: "Node 4" },
  { id: "5", graphId: "g1", name: "Node 5" },
]

const edges: GraphEdge[] = [
  {
    source: "1",
    target: "2",
    id: "1",
  },
  {
    source: "1",
    target: "3",
    id: "2",
  },
  {
    source: "1",
    target: "4",
    id: "3",
  },
]

export const Primary: Story = {
  args: {
    nodes: nodes,
    edges: edges,
  },
}
