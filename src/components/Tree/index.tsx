import { GraphNodeObj, GraphEdgeObj, GraphNode } from "src/types/Graph"
import { TreeNodeInput } from "src/components/Tree/Input"

// Function to find node by id
const findNodeById = (nodes: GraphNodeObj, id: string): GraphNode | undefined =>
  nodes[id]

// Recursive component to render a node and its children
const TreeNodeComponent = ({
  node,
  edges,
  nodes,
  depth,
}: {
  node: GraphNode
  edges: GraphEdgeObj
  nodes: GraphNodeObj
  depth: number
}) => {
  const childrenEdges = Object.values(edges).filter(
    (edge) => edge.src === node.id
  )

  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <TreeNodeInput node={node} />
      {childrenEdges.map((childEdge) => {
        const childNode = findNodeById(nodes, childEdge.dest)
        return childNode ? (
          <TreeNodeComponent
            key={childNode.id}
            node={childNode}
            edges={edges}
            nodes={nodes}
            depth={depth + 1}
          />
        ) : null
      })}
    </div>
  )
}

export const TreeView = ({
  nodes,
  edges,
}: {
  nodes: GraphNodeObj
  edges: GraphEdgeObj
}) => {
  // Identify root nodes (nodes that are not dest of any other nodes)
  const destNodeIds = new Set(Object.values(edges).map((edge) => edge.dest))
  const rootNodeIds = Object.keys(nodes).filter(
    (nodeId) => !destNodeIds.has(nodeId)
  )

  return (
    <div>
      {rootNodeIds.map((rootNodeId) => {
        const rootNode = findNodeById(nodes, rootNodeId)
        return rootNode ? (
          <TreeNodeComponent
            key={rootNode.id}
            node={rootNode}
            edges={edges}
            nodes={nodes}
            depth={0}
          />
        ) : null
      })}
    </div>
  )
}
