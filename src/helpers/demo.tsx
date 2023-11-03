// HELPER code to generate landing page grpahs

// const [nodes, setNodes] = useState<GraphNode[]>([])
// useEffect(() => {
//   const namedNodes = [
//     "Brainstorming",
//     "Research",
//     "Collaboration",
//     "Review",
//     "Documentation",
//   ]

//   // Create 25 nodes, with the first 5 being named
//   const nodes: GraphNode[] = Array.from({ length: 25 }, (_, index) => ({
//     id: (index + 1).toString(),
//     name: index < 5 ? namedNodes[index] : "",
//     graphId: "graph1",
//     date_created: Date.now(),
//     tags: [],
//     edges: [], // Edges will be added later
//   }))

//   // Function to create an edge
//   const createEdge = (sourceId: string, targetId: string): GraphEdge => ({
//     id: `edge-${sourceId}-${targetId}`,
//     source: sourceId,
//     target: targetId,
//     date_created: Date.now(),
//   })

//   // Function to add random edges for a node
//   const addRandomEdges = (node: GraphNode, allNodes: GraphNode[]) => {
//     const connections = 1 + Math.floor(Math.random() * 2) // Between 2 and 5 connections
//     const possibleTargets = allNodes.filter((n) => n.id !== node.id) // Exclude self
//     for (let i = 0; i < connections; i++) {
//       const targetNode =
//         possibleTargets[Math.floor(Math.random() * possibleTargets.length)]
//       node.edges?.push(createEdge(node.id, targetNode.id))
//     }
//   }

//   const addRandomTags = (node: GraphNode) => {
//     const threshold = 0.5 // 50% chance
//     const randomValue = Math.random() // Generate a random number between 0 and 1

//     if (randomValue > threshold) {
//       // Initialize the tags array if it doesn't exist
//       if (!node.tags) {
//         node.tags = []
//       }

//       // Define the available tags
//       const tags = [
//         "#IdeaGeneration",
//         "#InformationGathering",
//         "#QualityControl",
//       ]

//       // Select a random tag from the available tags
//       const randomTag = tags[Math.floor(Math.random() * tags.length)]

//       // Add the randomly selected tag to the node's tags
//       node.tags.push(randomTag)
//     }
//   }
//   // Add random edges to all nodes
//   nodes.forEach((node) => addRandomEdges(node, nodes))
//   nodes.forEach((node) => addRandomTags(node))
//   const nodes = console.log(JSON.stringify(nodes))
//   setNodes(nodes)
// }, [])
