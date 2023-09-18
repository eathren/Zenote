import React from "react"
import styles from "./index.module.css"
import { Link } from "react-router-dom"
import clsx from "clsx"

type Props = {
  id: string
  expanded: boolean
  hasChildren: boolean
}

const getDotActive = (
  expanded: boolean,
  hasChildren: boolean
): string | null => {
  if (!expanded && hasChildren) {
    return styles.dot__active
  }
  return null
}

const index: React.FC<Props> = ({ id, expanded, hasChildren }) => {
  return (
    <Link to={id}>
      <div className={clsx(styles.dot, getDotActive(expanded, hasChildren))}>
        &#8226;
      </div>
    </Link>
  )
}

export default index
