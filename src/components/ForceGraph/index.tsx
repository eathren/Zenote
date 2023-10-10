import * as d3 from "d3"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { GraphNode, GraphEdge } from "src/types" // Update the import path as needed

type ForceGraphProps = {
  graphId: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}

const ForceGraph = (props: ForceGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const navigate = useNavigate()
  const { graphId, nodes, edges } = props

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
          .id((d) => (d as GraphNode).id)
          .distance(100)
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
      .attr("r", 5)
      .attr("fill", "#AAAAAA")
      .style("transition", "all 0.3s ease-in-out")
      .on("mouseover", function (_event, d) {
        d3.select(this).attr("r", 10).attr("fill", "#82a8ff")

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
        d3.select(this).attr("r", 5).attr("fill", "#AAAAAA")

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
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!)

      nodeGroup.attr("transform", (d) => `translate(${d.x!}, ${d.y!})`)
    })

    function drag(simulation: d3.Simulation<GraphNode, undefined>) {
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
  }, [nodes, edges, navigate, graphId])

  return <svg ref={svgRef} width="100%" height="100%" />
}

export default ForceGraph
