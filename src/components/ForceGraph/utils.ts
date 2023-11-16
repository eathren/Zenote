import * as d3 from "d3"
import { GraphEdge, GraphNode } from "src/types"

export const createTagNodes = (nodes: GraphNode[]): GraphNode[] => {
  const tagsSet = new Set(nodes.flatMap((node) => node.tags || []))
  return [...tagsSet].map((tag) => ({
    id: `tag:${tag}`,
    name: `#${tag}`,
    tags: [],
    isTagNode: true,
  }))
}

export const createTagEdges = (nodes: GraphNode[]): GraphEdge[] => {
  const tagsEdges: GraphEdge[] = []

  nodes.forEach((node) => {
    node.tags?.forEach((tag) => {
      tagsEdges.push({
        id: `${node.id}->tag:${tag}`,
        source: node.id,
        target: `tag:${tag}`,
      })
    })
  })

  return tagsEdges
}

export const filterEdges = (nodes: GraphNode[]): GraphEdge[] => {
  const nodeIds = new Set(nodes.map((node) => node.id))
  return nodes.flatMap(
    (node) =>
      node.edges?.filter(
        (edge) =>
          nodeIds.has(edge.source as string) &&
          nodeIds.has(edge.target as string)
      ) || []
  )
}

export const filterNodesAndIncludeChildren = (
  nodes: GraphNode[],
  filterCriteria: string[]
): GraphNode[] => {
  let filteredNodes = nodes.filter((node) => node !== undefined)

  if (filterCriteria.length > 0) {
    filteredNodes = filteredNodes.filter(
      (node) =>
        node.tags?.some((tag) =>
          filterCriteria.some((criteria) =>
            tag.toLowerCase().includes(criteria)
          )
        ) ||
        filterCriteria.some((criteria) =>
          node.name.toLowerCase().includes(criteria)
        )
    )

    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id))

    // Include children of the filtered nodes
    nodes.forEach((node) => {
      node.edges?.forEach((edge) => {
        if (
          filteredNodeIds.has(edge.source as string) ||
          filteredNodeIds.has(edge.target as string)
        ) {
          filteredNodeIds.add(edge.source as string)
          filteredNodeIds.add(edge.target as string)
        }
      })
    })

    filteredNodes = nodes.filter((node) => filteredNodeIds.has(node.id))
  }

  return filteredNodes
}

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
