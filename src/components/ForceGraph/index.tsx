import * as d3 from "d3"
import React, { useEffect, useRef } from "react"
import { GraphNode, GraphEdge } from "src/types"

type ForceGraphProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
}

const ForceGraph: React.FC<ForceGraphProps> = ({
  nodes,
  edges,
  width,
  height,
}) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select(svgRef.current)

    // Clear the SVG for redrawing
    svg.selectAll("*").remove()

    // Add grey background to the SVG
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "grey")

    // Initialize D3 force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(edges).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Draw edges
    const link = svg
      .append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "white")

    // Create groups for nodes and text
    const nodeGroup = svg.append("g").selectAll("g").data(nodes).join("g")

    // Append circles to each group
    nodeGroup
      .append("circle")
      .attr("r", 5)
      .attr("fill", "white")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "blue")
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "white")
      })

    // Append text to each group
    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("font-size", "8px")
      .attr("dx", 8)
      .attr("dy", 4)

    // Update positions on each simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      nodeGroup.attr("transform", (d) => `translate(${d.x}, ${d.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, width, height])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default ForceGraph
