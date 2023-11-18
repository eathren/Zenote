import * as d3 from "d3"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GraphNode, GraphEdge } from "src/types" // Update the import path as needed
import "react-contexify/ReactContexify.css"
type ForceGraphProps = {
  graphId: string
  nodes: GraphNode[]
}

// Utility function for creating a drag behavior
export const drag = (simulation: d3.Simulation<GraphNode, undefined>) => {
  function dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
    d: GraphNode
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(
    event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
    d: GraphNode
  ) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(
    event: d3.D3DragEvent<SVGCircleElement, GraphNode, unknown>,
    d: GraphNode
  ) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  simulation.alpha(1).restart()
  return d3
    .drag<SVGCircleElement, GraphNode>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
}

const DemoGraph = (props: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()
  const { graphId } = props

  const [nodes, setNodes] = useState<GraphNode[]>(props.nodes)
  const [edges, setEdges] = useState<GraphEdge[]>([])

  const showOrphans = true,
    showTags = true,
    nodeSize = 5,
    linkStrength = 100,
    repelForce = 100,
    nodeGrowth = false

  const { startingNodes } = useParams()

  useEffect(() => {
    const filteredNodes = props.nodes.filter((node) => node !== undefined)
    const nodeSet = new Set(filteredNodes.map((node) => node.id))
    // const startingNodeIds = startingNodes ? startingNodes.split(",") : []

    // Function to check if a node exists in the Set
    const doesNodeExist = (nodeId: string) => nodeSet.has(nodeId)

    // Filter links where both source and target nodes exist
    const filteredEdges = props.nodes
      .flatMap((node) => node.edges || [])
      .filter(
        (link) =>
          doesNodeExist(link.source as string) &&
          doesNodeExist(link.target as string)
      )
    const connectedNodeSet = new Set()
    filteredEdges.forEach((edge) => {
      connectedNodeSet.add(edge.source)
      connectedNodeSet.add(edge.target)
    })

    // Collect unique tags
    const tagsSet = new Set(filteredNodes.flatMap((node) => node.tags || []))
    const tagNodes: GraphNode[] = [...tagsSet].map((tag) => ({
      id: `tag:${tag}`,
      name: `${tag}`,
      tags: [],
      isTagNode: true,
    }))
    const tagsEdges: GraphEdge[] = []

    filteredNodes.forEach((node) => {
      node.tags?.forEach((tag) => {
        tagsEdges.push({
          id: `${node.id}->tag:${tag}`,
          source: node.id,
          target: `tag:${tag}`,
        })
      })
    })

    setNodes([...tagNodes, ...filteredNodes])
    setEdges([...filteredEdges, ...tagsEdges])
  }, [props.nodes, showOrphans, showTags, startingNodes])
  const getNodeColor = useCallback((isTagNode: boolean = false) => {
    // Default color for tag nodes
    if (isTagNode) {
      return "#82a8ff" // Light blue
    }

    return "#ffffff"
  }, [])

  const calculateNodeSizeHover = useCallback(
    (d: GraphNode) => {
      const numOutgoingEdges = edges.filter((edge) => edge.source === d).length
      if (!nodeGrowth) return nodeSize + numOutgoingEdges
      return nodeSize + 5 + numOutgoingEdges
    },
    [edges, nodeGrowth, nodeSize]
  )

  const calculateNodeSize = useCallback(
    (d: GraphNode) => {
      if (!nodeGrowth) return nodeSize
      const numOutgoingEdges = edges.filter((edge) => edge.source === d).length
      return nodeSize + numOutgoingEdges
    },
    [edges, nodeGrowth, nodeSize]
  )

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    svg.selectAll("*").remove() // Clear SVG for redrawing

    const parentElement = svgRef.current.parentElement
    const width = parentElement ? parentElement.clientWidth : 800
    const height = parentElement ? parentElement.clientHeight : 600

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id((d) => (d as GraphNode).id!)
          .distance(linkStrength)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

    const container = svg.append("g")

    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "#AAAAAA")
      .style("transition", "all 0.3s ease-in-out")

    const nodeGroup = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any)

    nodeGroup
      .append("circle")
      .attr("r", (d) => calculateNodeSize(d))
      .attr("fill", (d) => getNodeColor(d.isTagNode))
      .style("transition", "all 0.3s ease-in-out")
      .on("mouseover", function (_event, d) {
        d3.select(this)
          .attr("r", calculateNodeSizeHover(d))
          .attr("fill", "#82a8ff")

        link
          .filter((l: GraphEdge) => l.source === d || l.target === d)
          .attr("stroke", "#82a8ff")

        // Fade out other nodes and links
        link
          .filter((l: GraphEdge) => l.source !== d && l.target !== d)
          .attr("stroke-opacity", 0.1)

        nodeGroup
          .filter((n: GraphNode) => {
            return (
              n !== d &&
              !edges.find(
                (e) =>
                  (e.source === n && e.target === d) ||
                  (e.source === d && e.target === n)
              )
            )
          })
          .attr("opacity", 0.1)
      })
      .on("mouseout", function (_event, d) {
        // Reset the node color and size to the original
        d3.select(this)
          .attr("r", calculateNodeSize(d))
          .attr("fill", getNodeColor(d.isTagNode))

        // Reset link colors to the original
        link.attr("stroke", "#AAAAAA")

        // Remove the fading out of other nodes and links
        nodeGroup.attr("opacity", 1)
        link.attr("stroke-opacity", 1)
      })

    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("font-size", "8px")
      .attr("dx", 0)
      .attr("dy", 20)
      .attr("fill", "#FFFFFF")

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => {
          if ((d.source as GraphNode).x !== undefined) {
            return (d.source as GraphNode).x!
          }
          return 0
        })
        .attr("y1", (d) => {
          if ((d.source as GraphNode).y !== undefined) {
            return (d.source as GraphNode).y!
          }
          return 0
        })
        .attr("x2", (d) => {
          if ((d.target as GraphNode).x !== undefined) {
            return (d.target as GraphNode).x!
          }
          return 0
        })
        .attr("y2", (d) => {
          // Ensure the target node exists
          if ((d.target as GraphNode).y !== undefined) {
            return (d.target as GraphNode).y!
          }
          return 0
        })
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!)

      nodeGroup.attr("transform", (d) => `translate(${d.x!}, ${d.y!})`)
    })
  }, [
    nodes,
    edges,
    navigate,
    graphId,
    calculateNodeSize,
    repelForce,
    linkStrength,
    calculateNodeSizeHover,
    getNodeColor,
  ])

  return (
    <div style={{ height: "300px", position: "relative" }}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  )
}

export default DemoGraph
