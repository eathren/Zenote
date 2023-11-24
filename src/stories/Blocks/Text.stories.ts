import Text from "src/components/Blocks/Text"
import type { Meta, StoryObj } from "@storybook/react"
import { withRouter } from "storybook-addon-react-router-v6"
import { BlockType, TextType } from "src/types/blocks"

const meta: Meta<typeof Text> = {
  title: "Blocks/Text",
  component: Text,
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
    text: DemoText,
  },
}
