import React from "react"
import Block from "src/components/Note/Block"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useGraphStore } from "src/stores/graphStore"
import { GraphEdgeObj, GraphNodeObj } from "src/types/Graph"

// Recursive component to render GraphNode and its children
// const TreeNodeComponent = ({
//   node,
//   edges,
// }: {
//   node: GraphNodeObj
//   edges: GraphEdgeObj
// }) => {
//   const { addNode } = useGraphStore()

//   const handleEnter = (event: React.KeyboardEvent) => {
//     if (event.key === "Enter") {
//       event.stopPropagation()
//       addNode()
//     }
//   }

//   const childNodes = Object.values(edges)
//     .filter((edge) => edge.src === node.id)
//     .map((edge) => edge.dest)

//   return (
//     <div style={{ marginLeft: "20px" }} onKeyDown={handleEnter}>
//       <Block {...node} />
//       {node.expanded &&
//         childNodes.map((childId) => (
//           <TreeNodeComponent
//             key={childId}
//             node={edges[childId]}
//             edges={edges}
//           />
//         ))}
//     </div>
//   )
// }

export const TreeView = ({
  nodes,
  edges,
}: {
  nodes: GraphNodeObj
  edges: GraphEdgeObj
}) => {
  const rootNodeIds = Object.keys(nodes) // Assume these are your root nodes

  return (
    <div>
      {Object.values(nodes).map((node) => (
        <div key={node.id}>{node.content}</div>
      ))}
      {/* {rootNodeIds.map((nodeId) => (

        // <TreeNodeComponent key={nodeId} node={nodes[nodeId]} edges={edges} />
      ))} */}
    </div>
  )
}
