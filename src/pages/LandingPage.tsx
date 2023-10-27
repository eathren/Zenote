import { Typography, Button, Row, Col, Card } from "antd"
import { Link } from "react-router-dom"
const { Title, Paragraph, Text } = Typography

const LandingPage = () => {
  return (
    <>
      <Typography>
        <Title level={1}>Welcome to Zenote</Title>
        <Text strong style={{ fontSize: "18px" }}>
          A Note-Taking App Designed to Mimic How Your Brain Works.
        </Text>

        <Row gutter={[32, 32]} style={{ marginTop: "40px" }}>
          {/* Existing Cards */}
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Create Nodes</Title>
              <Paragraph>
                With Zenote, your notes are not just static text; they're
                dynamic nodes that can evolve, just like your ideas. Create
                nodes for every important piece of information and organize them
                as you would in your mind.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Make Connections</Title>
              <Paragraph>
                Don't let your notes exist in isolation. Create meaningful
                connections between nodes to build a robust knowledge network.
                This interlinking mimics the natural way our brains work to help
                you understand better.
              </Paragraph>
            </Card>
          </Col>

          {/* New Cards */}
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Advanced Tables</Title>
              <Paragraph>
                Create tables that do more than just hold data. With sorting,
                filtering, and grouping features, you can make sense of your
                information effortlessly. Merge cells, add footnotes, and even
                embed media to make your tables more comprehensive.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Online-First Database</Title>
              <Paragraph>
                Built on an online-first database architecture, Zenote ensures
                you always have the latest version of your notes. Work
                seamlessly from any device, anywhere.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Sharing and Collaboration</Title>
              <Paragraph>
                Easily share nodes, connections, or entire graphs with team
                members or friends. Real-time collaboration features enable
                multiple users to work on the same notes, ensuring everyone is
                on the same page.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card hoverable>
              <Title level={4}>Fill Out Notes</Title>
              <Paragraph>
                Give your nodes and connections more context by filling them out
                with detailed notes. Add references, files, or just your
                thoughts to make each node a treasure trove of information.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: "40px" }}>
          <Col span={24}>
            <Link to="/signup">
              <Button size="large">Get Started with Zenote</Button>
            </Link>
          </Col>
        </Row>
      </Typography>
    </>
  )
}

export default LandingPage
