import * as d3 from "d3"
import { GraphNode } from "src/types" // Update the import path as needed

// Utility function for creating a zoom behavior
export const createZoom = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  container: d3.Selection<SVGGElement, unknown, null, undefined>
) => {
  const zoom: d3.ZoomBehavior<SVGSVGElement, unknown> = d3
    .zoom<SVGSVGElement, unknown>()
    .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      const transform = event.transform
      container.attr("transform", transform.toString())
    })

  svg.call(zoom)
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
