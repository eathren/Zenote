import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { GraphNode } from "src/types"
import { useNodes } from "./useNodes"

type UseNodeModalProps = {
  isOpen: boolean
}

export const useNodeModal = ({ isOpen }: UseNodeModalProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { graphId } = useParams<{ graphId?: string }>()
  const { nodes } = useNodes(graphId)
  const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>(nodes)

  useEffect(() => {
    setFilteredNodes(nodes)
  }, [graphId, nodes])

  useEffect(() => {
    setFilteredNodes(
      nodes?.filter((node) =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [nodes, searchTerm])

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Function to reset searchTerm
  const resetSearchTerm = () => {
    setSearchTerm("")
  }

  useEffect(() => {
    resetSearchTerm()
  }, [isOpen])

  return { searchTerm, handleSearchTermChange, filteredNodes, resetSearchTerm }
}
