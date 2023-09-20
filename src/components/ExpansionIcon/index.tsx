import React from "react"
import { CaretRightOutlined } from "@ant-design/icons"
import styles from "./index.module.css" // Importing CSS Module

type Props = {
  expanded: boolean
  setExpanded: () => void
}

const ExpansionIcon: React.FC<Props> = ({ expanded, setExpanded }) => {
  // Use the scoped class names from the CSS module
  const iconClass = expanded
    ? `${styles.animated_icon} ${styles.expanded_icon}`
    : styles.animated_icon

  return <CaretRightOutlined className={iconClass} onClick={setExpanded} />
}

export default ExpansionIcon
