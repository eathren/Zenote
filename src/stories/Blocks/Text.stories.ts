import type { Meta, StoryObj } from "@storybook/react"
import { withRouter } from "storybook-addon-react-router-v6"
import { BlockType, TextType } from "src/types/blocks"
import TextBlock from "src/components/Blocks/TextBlock"

const meta: Meta<typeof TextBlock> = {
  title: "Blocks/Text",
  component: TextBlock,
  decorators: [withRouter],
  parameters: {},
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof meta>

const DemoText: TextType = {
  id: "1",
  type: BlockType.Text,
  content: [""],
  properties: {
    content: "Test",
  },
}

export const Primary: Story = {
  args: {
    block: DemoText,
  },
}
