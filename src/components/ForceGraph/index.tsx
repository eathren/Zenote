import * as d3 from "d3"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GraphNode, GraphEdge } from "src/types" // Update the import path as needed
import {
  createTagEdges,
  createTagNodes,
  drag,
  filterEdges,
  filterNodesAndIncludeChildren,
} from "./utils"
import "react-contexify/ReactContexify.css"

import useGraphSettingsStore from "src/stores/graphSettingsStore"
type ForceGraphProps = {
  graphId: string
  nodes: GraphNode[]
}

const ForceGraph = (props: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()
  const { graphId } = props
  const [searchParams] = useSearchParams()
  const [nodes, setNodes] = useState<GraphNode[]>(props.nodes)
  const [edges, setEdges] = useState<GraphEdge[]>([])

  const { getOrInitializeSettings } = useGraphSettingsStore()
  const {
    nodeSize,
    nodeGrowth,
    repelForce,
    linkStrength,
    groups,
    // showTags,
    showOrphans,
  } = getOrInitializeSettings(graphId)

  useEffect(() => {
    let filteredNodes = props.nodes.filter((node) => node !== undefined)

    const filterParam = searchParams.get("filter")
    if (filterParam) {
      const filterCriteria = filterParam
        ? filterParam.split(",").map((tag) => tag.trim().toLowerCase())
        : []
      filteredNodes = filterNodesAndIncludeChildren(props.nodes, filterCriteria)
    }

    const filteredEdges = filterEdges(filteredNodes)
    const tagNodes = createTagNodes(filteredNodes)
    const tagEdges = createTagEdges(filteredNodes)
    setNodes([...tagNodes, ...filteredNodes])
    setEdges([...filteredEdges, ...tagEdges])

    // }
  }, [props.nodes, searchParams, showOrphans])

  // console.log("nodes", nodes, "edges", edges)

  const getNodeColor = useCallback(
    (nodeName: string, tags: string[] = [], isTagNode: boolean = false) => {
      // Default color for tag nodes
      if (isTagNode) {
        return "#82a8ff" // Light blue
      }

      let color = "#ffffff"

      groups?.forEach((group) => {
        // Case-insensitive check for group name in node name
        if (nodeName.toLowerCase().includes(group.name.toLowerCase())) {
          color = group.color as string
        }

        tags.forEach((tag) => {
          // Remove "tag:" prefix and make it case-insensitive
          const tagWithoutPrefix = tag.replace(/^tag:/i, "").toLowerCase()
          if (tagWithoutPrefix === group.name.toLowerCase()) {
            color = group.color as string
          }
        })
      })

      return color
    },
    [groups]
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

    const applyDragBehavior = (
      selection:
        | d3.Selection<SVGCircleElement, GraphNode, SVGGElement, unknown>
        | any
    ) => {
      selection
        .on(
          "start",
          (
            event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
            d: GraphNode
          ) => {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            d.fx = event.x
            d.fy = event.y
          }
        )
        .on(
          "drag",
          (
            event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
            d: GraphNode
          ) => {
            d.fx = event.x
            d.fy = event.y
            // Change color and size on drag
            d3.select(event.sourceEvent.target as SVGCircleElement)
              .attr("fill", "#82a8ff")
              .attr("r", calculateNodeSizeHover(d))
              .transition() // Start a transition
              .duration(300) // Duration in milliseconds
              .ease(d3.easeCubicInOut) // Ease-in-out transition
              .style("font-size", "12px")
              .attr("dy", 25)
              .attr("fill", "#82a8ff")
          }
        )
        .on(
          "end",
          (
            event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>,
            d: GraphNode
          ) => {
            if (!event.active) simulation.alphaTarget(0)
            d.fx = null
            d.fy = null
            // Reset color and size after drag ends
            d3.select(event.sourceEvent.target as SVGCircleElement)
              .attr("fill", getNodeColor(d.name, d.tags, d.isTagNode))
              .attr("r", calculateNodeSize(d))
          }
        )
    }

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
      .call(applyDragBehavior)

    nodeGroup
      .append("circle")
      .attr("r", (d) => calculateNodeSize(d))
      .attr("fill", (d) => getNodeColor(d.name, d.tags, d.isTagNode))
      .style("transition", "all 0.3s ease-in-out")
      .on("mouseover", function (_event, d) {
        d3.select(this)
          .attr("r", calculateNodeSizeHover(d))
          .attr("fill", "#82a8ff")
          .attr("text")

        nodeGroup
          .selectAll("text")
          .filter((n: GraphNode | any) => n.id === d.id)
          .style("font-size", "12px")
          .attr("dy", 20)
          .attr("fill", "#82a8ff")
          .style("transition", "all 0.1s ease-in-out")

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
          .attr("fill", getNodeColor(d.name, d.tags, d.isTagNode))

        // Reset link colors to the original
        link.attr("stroke", "#AAAAAA")

        nodeGroup
          .selectAll("text")
          .filter((n: GraphNode | any) => n.id === d.id)
          .style("font-size", "8px")
          .attr("dy", 20)
          .attr("fill", "#FFFFFF")
          .style("transition", "all 0.2s ease-in-out")

        // Remove the fading out of other nodes and links
        nodeGroup.attr("opacity", 1)
        link.attr("stroke-opacity", 1)
      })
      .on("click", (_event, d) => {
        if (!d.isTagNode) {
          navigate(`/graphs/${graphId}/node/${d.id}`)
        }
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
    <div style={{ height: "100vh", maxHeight: "100%", position: "relative" }}>
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  )
}

export default ForceGraph
