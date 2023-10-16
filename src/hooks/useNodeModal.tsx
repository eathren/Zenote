import { useState, useEffect } from "react"
import { GraphNode } from "src/types"

type UseNodeModalProps = {
  isOpen: boolean
  nodes: GraphNode[]
}

export const useNodeModal = ({ isOpen, nodes }: UseNodeModalProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>(nodes)

  useEffect(() => {
    setFilteredNodes(
      nodes.filter((node) =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [nodes, searchTerm])

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  useEffect(() => {
    setSearchTerm("")
  }, [isOpen])

  return { searchTerm, handleSearchTermChange, filteredNodes }
}
