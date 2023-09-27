import React, { useState } from "react"
import { TreeNodeInput } from "src/components/Tree/Input"
import { TreeNode } from "src/types/Tree"
import { Row } from "antd"
import styles from "./index.module.css"
import ExpansionIcon from "src/components/ExpansionIcon"
import Dot from "src/components/Dot"
import { AddButton } from "src/components/AddButton"

const RenderTreeNodes: React.FC<{ node: TreeNode }> = ({ node }) => {
  const [expanded, setExpanded] = useState<boolean>(node.expanded)

  return (
    <div key={node.id}>
      <Row>
        <div className={styles.node__icon}>
          {node.children.length > 0 && (
            <ExpansionIcon
              expanded={expanded}
              setExpanded={() => setExpanded(!expanded)}
            />
          )}
          <Dot
            itemId={node.id}
            expanded={expanded}
            hasChildren={node.children.length > 0}
          />
        </div>
        <TreeNodeInput node={node} />
      </Row>

      {node.children && expanded && node.children.length > 0 && (
        <div className={styles.node__children}>
          {node.children.map((child) => (
            <RenderTreeNodes key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}

type TreeViewProps = {
  tree: TreeNode | TreeNode[]
}

export const TreeView: React.FC<TreeViewProps> = ({ tree }) => {
  const normalizedTree = Array.isArray(tree) ? tree : [tree]

  return (
    <div>
      {normalizedTree.map((root) => (
        <RenderTreeNodes key={root.id} node={root} />
      ))}
      <AddButton />
    </div>
  )
}
