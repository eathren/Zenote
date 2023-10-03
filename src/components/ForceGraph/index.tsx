import * as d3 from "d3"
import { useEffect, useRef } from "react"
import { GraphNode } from "src/types"

type ForceGraphProps = {
  nodes: GraphNode[]
}
const ForceGraph: React.FC<ForceGraphProps> = ({ nodes }) => {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Check if SVG exists in DOM
    if (!svgRef.current) {
      return
    }

    // Initialize SVG and its dimensions
    const svg = d3.select(svgRef.current)
    const width = 640,
      height = 480

    // Clear previous nodes if they exist/
    // svg.select("g").selectAll("circle").remove()

    // Initialize D3 force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0))
    // .force("charge", d3.forceManyBody().strength(-400))
    // .force("center", d3.forceCenter(width / 2, height / 2))

    // Create circles for each node in the graph
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "blue")

    // Update node positions at each simulation "tick"
    simulation.on("tick", () => {
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y)
    })

    // Clean up simulation if component is unmounted
    return () => {
      simulation.stop()
    }
  }, [nodes])

  return <svg ref={svgRef} width="800" height="600"></svg>
}

export default ForceGraph
