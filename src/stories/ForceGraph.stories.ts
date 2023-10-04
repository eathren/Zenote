import ForceGraph from "src/components/ForceGraph"
import type { Meta, StoryObj } from "@storybook/react"
import { GraphNode } from "src/types"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/ForceGraph",
  component: ForceGraph,
  parameters: {},
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} satisfies Meta<typeof ForceGraph>

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
  {
    id: "4",
    graphId: "g1",
    name: "Node 4",
  },
  {
    id: "5",
    graphId: "g1",
    name: "Node 5",
  },
  {
    id: "6",
    graphId: "g1",
    name: "Node 6",
  },
]

// const edges: GraphEdge[] = [
//   {
//     src: "1",
//     dest: "2",
//     id: "1",
//   },
// ]

export const Primary: Story = {
  args: {
    nodes: nodes,
    edges: [],
    width: 800,
    height: 800,
  },
}
