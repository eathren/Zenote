import * as d3 from "d3"
import { GraphEdge, GraphNode } from "src/types"
import { findNode } from "src/utils"

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

export const filterEdges = (nodes: GraphNode[]) => {
  const nodeIds = new Set(nodes.map((node) => node.id))

  // Flatten the array of arrays of edges into a single array of edges
  const allEdges = nodes.flatMap((node) => node.edges || [])

  // Filter the edges
  const filteredEdges = allEdges.filter(
    (edge) =>
      nodeIds.has(
        typeof edge.source === "object" ? edge.source.id : edge.source
      ) &&
      nodeIds.has(
        typeof edge.target === "object" ? edge.target.id : edge.target
      )
  )
  return filteredEdges
}

export const filterNodesAndIncludeChildren = (
  nodes: GraphNode[],
  filterCriteria: string[]
): GraphNode[] => {
  // Filter nodes based on criteria
  const filteredNodes = nodes.filter(
    (node) =>
      filterCriteria.length === 0 ||
      (node.tags &&
        node.tags.some((tag) =>
          filterCriteria.some((criteria) =>
            tag.toLowerCase().includes(criteria)
          )
        )) ||
      filterCriteria.some((criteria) =>
        node.name.toLowerCase().includes(criteria)
      )
  )

  // Set to track included node IDs to avoid duplicates
  const includedNodeIds = new Set(filteredNodes.map((node) => node.id))

  // Process edges and connected nodes
  const output = [...filteredNodes]
  filteredNodes.forEach((node) => {
    node.edges?.forEach((edge) => {
      const target = edge.target as GraphNode
      const targetNode = findNode(nodes, target.id as string)
      if (targetNode && !includedNodeIds.has(targetNode.id)) {
        includedNodeIds.add(targetNode.id)
        output.push(targetNode)
      }
    })
  })
  console.log(output)

  return output
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
