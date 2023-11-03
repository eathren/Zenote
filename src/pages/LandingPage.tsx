import { Typography, Button, Image, Row, Col, Card } from "antd"
import { Link } from "react-router-dom"
import Highlighted from "src/assets/images/zenote_highlight.png"
import DemoGraph from "src/components/DemoGraph"

const { Title, Paragraph, Text } = Typography

const LandingPage = () => {
  const nodes = [
    {
      id: "1",
      name: "Brainstorming",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#InformationGathering"],
      edges: [
        {
          id: "edge-1-15",
          source: "1",
          target: "15",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "2",
      name: "Research",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-2-8",
          source: "2",
          target: "8",
          date_created: 1698986514724,
        },
        {
          id: "edge-2-12",
          source: "2",
          target: "12",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "3",
      name: "Collaboration",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#InformationGathering"],
      edges: [
        {
          id: "edge-3-8",
          source: "3",
          target: "8",
          date_created: 1698986514724,
        },
        {
          id: "edge-3-23",
          source: "3",
          target: "23",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "4",
      name: "Review",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#InformationGathering"],
      edges: [
        {
          id: "edge-4-8",
          source: "4",
          target: "8",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "5",
      name: "Documentation",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-5-21",
          source: "5",
          target: "21",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "6",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#QualityControl"],
      edges: [
        {
          id: "edge-6-20",
          source: "6",
          target: "20",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "7",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-7-25",
          source: "7",
          target: "25",
          date_created: 1698986514724,
        },
        {
          id: "edge-7-14",
          source: "7",
          target: "14",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "8",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-8-19",
          source: "8",
          target: "19",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "9",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#InformationGathering"],
      edges: [
        {
          id: "edge-9-21",
          source: "9",
          target: "21",
          date_created: 1698986514724,
        },
      ],
    },
    {
      id: "10",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#QualityControl"],
      edges: [
        {
          id: "edge-10-8",
          source: "10",
          target: "8",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "11",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#QualityControl"],
      edges: [
        {
          id: "edge-11-13",
          source: "11",
          target: "13",
          date_created: 1698986514725,
        },
        {
          id: "edge-11-17",
          source: "11",
          target: "17",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "12",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-12-13",
          source: "12",
          target: "13",
          date_created: 1698986514725,
        },
        {
          id: "edge-12-2",
          source: "12",
          target: "2",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "13",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-13-5",
          source: "13",
          target: "5",
          date_created: 1698986514725,
        },
        {
          id: "edge-13-9",
          source: "13",
          target: "9",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "14",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#InformationGathering"],
      edges: [
        {
          id: "edge-14-11",
          source: "14",
          target: "11",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "15",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-15-21",
          source: "15",
          target: "21",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "16",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#IdeaGeneration"],
      edges: [
        {
          id: "edge-16-22",
          source: "16",
          target: "22",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "17",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-17-7",
          source: "17",
          target: "7",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "18",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-18-25",
          source: "18",
          target: "25",
          date_created: 1698986514725,
        },
        {
          id: "edge-18-5",
          source: "18",
          target: "5",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "19",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-19-16",
          source: "19",
          target: "16",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "20",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#IdeaGeneration"],
      edges: [
        {
          id: "edge-20-24",
          source: "20",
          target: "24",
          date_created: 1698986514725,
        },
        {
          id: "edge-20-19",
          source: "20",
          target: "19",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "21",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-21-8",
          source: "21",
          target: "8",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "22",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-22-24",
          source: "22",
          target: "24",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "23",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: ["#IdeaGeneration"],
      edges: [
        {
          id: "edge-23-14",
          source: "23",
          target: "14",
          date_created: 1698986514725,
        },
        {
          id: "edge-23-6",
          source: "23",
          target: "6",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "24",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-24-14",
          source: "24",
          target: "14",
          date_created: 1698986514725,
        },
        {
          id: "edge-24-7",
          source: "24",
          target: "7",
          date_created: 1698986514725,
        },
      ],
    },
    {
      id: "25",
      name: "",
      graphId: "graph1",
      date_created: 1698986514724,
      tags: [],
      edges: [
        {
          id: "edge-25-8",
          source: "25",
          target: "8",
          date_created: 1698986514725,
        },
      ],
    },
  ]

  return (
    <>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Typography>
          <Title level={1}>Connect everything</Title>
          <Text strong style={{ fontSize: "18px" }}>
            Zenote is a note-taking app designed to mimic how your brain works.
          </Text>
          <br />
          <div
            style={{
              margin: "0 auto",
              textAlign: "center",
              maxWidth: "1000px",
            }}
          >
            <Image preview={false} src={Highlighted} width={"100%"} />
          </div>

          <Row gutter={[32, 32]} style={{ marginTop: "40px" }}>
            {/* Existing Cards */}
            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Create Nodes</Title>
                <Paragraph>
                  With Zenote, your notes are not just static text; they're
                  dynamic nodes that can evolve, just like your ideas. Create
                  nodes for every important piece of information and organize
                  them as you would in your mind.
                </Paragraph>
              </Card>
              {/* <img src={Mobile} alt="Description" height="50%" /> */}
            </Col>
            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Make Connections</Title>
                <Paragraph>
                  Don't let your notes exist in isolation. Create meaningful
                  connections between nodes to build a robust knowledge network.
                  This interlinking mimics the natural way our brains work to
                  help you understand better.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Visualize your thoughts</Title>
                <Paragraph>
                  Zenote's graph view allows you to see your notes in a new way.
                  Visualize your ideas and thought processes as a network of
                  nodes and connections, and gain new insights into your work.
                </Paragraph>
                <div style={{ maxHeight: "600px" }}>
                  <DemoGraph graphId={"demo"} nodes={nodes} />
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Sharing and Collaboration</Title>
                <Paragraph>
                  Easily share nodes, connections, or entire graphs with team
                  members, friends, or just make them global! Real-time
                  collaboration features enable multiple users to work on the
                  same notes, ensuring everyone is on the same page.
                </Paragraph>
              </Card>
              <br />
              <Card hoverable>
                <Title level={4}>Online-First Functionality</Title>
                <Paragraph>
                  Built on an online-first database architecture, Zenote ensures
                  you always have the latest version of your notes. Work
                  seamlessly from any device, anywhere.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Fill Out Notes</Title>
                <Paragraph>
                  Give your nodes and connections more context by filling them
                  out with detailed notes. Add references, files, or just your
                  thoughts to make each node a treasure trove of information.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                <Title level={4}>Dynamic tagging and filtering</Title>
                <Paragraph>
                  Make even more connections with tags, and filter them as
                  needed, and hide them when not. Now, making connections
                  between different subjects has never been easier.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
              <div style={{ textAlign: "center", marginTop: "60px" }}>
                <Title level={2}>Ready to Elevate Your Note-Taking?</Title>
                <Paragraph strong style={{ fontSize: "18px" }}>
                  Join Zenote today and transform your productivity. Our
                  platform is designed to make your ideas come to life. Try it
                  now and see the difference.
                </Paragraph>
                <Button type="primary" size="large">
                  <Link to="/signup">Sign Up & Start Exploring</Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Typography>
      </div>
    </>
  )
}

export default LandingPage
