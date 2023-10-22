import * as d3 from "d3"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GraphNode, GraphEdge } from "src/types" // Update the import path as needed
import { drag } from "./utils"
import { Item, Menu, useContextMenu } from "react-contexify"
import "react-contexify/ReactContexify.css"
import GraphControls from "src/components/GraphControls"
import useGraphSettingsStore from "src/stores/graphSettingsStore"

type ForceGraphProps = {
  graphId: string
  nodes: GraphNode[]
}

const ForceGraph = (props: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()
  const { graphId, nodes } = props
  const [edges, setEdges] = useState<GraphEdge[]>([])

  const { show } = useContextMenu({
    id: "forceGraphContextMenu",
  })

  const { getOrInitializeSettings } = useGraphSettingsStore()
  const { nodeSize, nodeGrowth, repelForce, linkStrength, nodeStrength } =
    getOrInitializeSettings(graphId)

  // Capture the right click on a node or a link and show the context menu
  const handleContextMenu = useCallback(
    (event: MouseEvent, id: string) => {
      event.preventDefault()
      console.log("Right click detected, showing context menu.") // Debugging log
      show({ event, props: { id } })
    },
    [show]
  )

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
    const filteredNodes = nodes.filter((node) => node !== undefined)
    const e = filteredNodes.flatMap((node) => node.edges || []) // Use || [] to handle undefined edges
    setEdges(e)
  }, [nodes])
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
      .attr("fill", "#AAAAAA")
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
        d3.select(this).attr("r", calculateNodeSize(d)).attr("fill", "#AAAAAA")

        link
          .filter((l: GraphEdge) => l.source === d || l.target === d)
          .attr("stroke", "#AAAAAA")

        // Revert fading out of other nodes and links
        link.attr("stroke-opacity", 1)
        nodeGroup.attr("opacity", 1)
      })
      .on("click", (_event, d) => {
        navigate(`/graphs/${graphId}/node/${d.id}`)
      })

    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("font-size", "8px")
      .attr("dx", 0)
      .attr("dy", 20)
      .attr("fill", "#FFFFFF")

    const zoom: d3.ZoomBehavior<SVGSVGElement, unknown> = d3
      .zoom<SVGSVGElement, unknown>()
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const transform = event.transform
        container.attr("transform", transform.toString())
      })

    svg.call(zoom)

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
    nodeGroup.on("contextmenu", (event: MouseEvent, d: GraphNode) => {
      handleContextMenu(event, d.id!)
    })

    // Add right-click context menu for links
    link.on("contextmenu", (event: MouseEvent, d: GraphEdge) => {
      handleContextMenu(event, d.id)
    })
  }, [
    nodes,
    edges,
    navigate,
    graphId,
    handleContextMenu,
    calculateNodeSize,
    repelForce,
    linkStrength,
    calculateNodeSizeHover,
  ])

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
      <GraphControls />
    </div>
  )
}

export default ForceGraph
