// SubPage.tsx
import React from "react"
import { useParams } from "react-router-dom"

export const SubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  if (!id) return <></>

  return <></>
}
