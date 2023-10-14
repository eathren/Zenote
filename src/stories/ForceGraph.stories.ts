import ForceGraph from "src/components/ForceGraph"
import type { Meta, StoryObj } from "@storybook/react"
import { GraphNode } from "src/types"
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
    date_created: Date.now(),
    edges: [
      {
        source: "1",
        target: "2",
        id: "1",
        graphId: "1",
        date_created: Date.now(),
      },
      {
        source: "1",
        target: "3",
        id: "2",
        graphId: "1",
        date_created: Date.now(),
      },
      {
        source: "1",
        target: "4",
        id: "3",
        graphId: "1",
        date_created: Date.now(),
      },
    ],
  },
  {
    id: "3",
    graphId: "g1",
    name: "Node 3",
    date_created: Date.now(),
    edges: [],
  },
  {
    id: "4",
    graphId: "g1",
    name: "Node 4",
    date_created: Date.now(),
    edges: [],
  },

  {
    id: "5",
    graphId: "g1",
    name: "Node 5",
    date_created: Date.now(),
    edges: [],
  },
]

export const Primary: Story = {
  args: {
    nodes: nodes,
  },
}
