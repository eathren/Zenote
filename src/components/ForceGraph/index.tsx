import * as d3 from "d3"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { GraphNode, GraphEdge } from "src/types"

type ForceGraphProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const ForceGraph = ({ nodes, edges }: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear SVG for redrawing

    // Dark mode background
    svg
      .append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#141414")

    const parentElement = svgRef.current.parentElement
    const width = parentElement ? parentElement.clientWidth : 800
    const height = parentElement ? parentElement.clientHeight : 600

    // Initialize D3 force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(edges).id((d) => (d as GraphNode).id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))

    // Draw edges
    const link = svg
      .append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", "#AAAAAA") // Light grey for dark mode

    const nodeGroup = svg.append("g").selectAll("g").data(nodes).join("g")

    // Append circles and text to each group
    nodeGroup
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#AAAAAA") // Light grey for dark mode
      .on("click", function (d: GraphNode) {
        navigate(`/${d.graphId}/${d.id}`)
      })
      .on("mouseover", function (d: GraphNode) {
        d3.select(this).attr("fill", "lightblue").attr("r", 7)
        link
          .filter((l: GraphEdge) => l.source === d || l.target === d)
          .attr("stroke", "lightblue")
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#AAAAAA").attr("r", 5)
        link.attr("stroke", "#AAAAAA")
      })

    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("font-size", "8px")
      .attr("dx", 8)
      .attr("dy", 4)

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!)

      nodeGroup.attr("transform", (d) => `translate(${d.x!}, ${d.y!})`)
    })

    return () => {
      simulation.stop()
    }
  }, [nodes, edges, navigate])

  return <svg ref={svgRef} width="100%" height="100%" />
}

export default ForceGraph
