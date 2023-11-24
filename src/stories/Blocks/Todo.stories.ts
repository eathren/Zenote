import TodoBlock from "src/components/Blocks/TodoBlock"
import type { Meta, StoryObj } from "@storybook/react"
import { withRouter } from "storybook-addon-react-router-v6"
const meta: Meta<typeof TodoBlock> = {
  title: "Blocks/TodoBlock",
  component: TodoBlock,
  decorators: [withRouter],
  parameters: {},
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}
