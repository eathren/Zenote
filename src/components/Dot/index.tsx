import styles from "./index.module.css"
import { Link, useParams } from "react-router-dom"
import clsx from "clsx"

type Props = {
  itemId: string
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

const getDotHidden = (id: string | undefined, itemId: string) => {
  if (id === itemId) {
    return styles.dot__hidden
  }
  return null
}

const Dot = ({ itemId, expanded, hasChildren }: Props) => {
  const { id } = useParams()

  return (
    <Link to={itemId}>
      <div
        className={clsx(
          styles.dot,
          getDotHidden(id, itemId),
          getDotActive(expanded, hasChildren)
        )}
      >
        &#8226;
      </div>
    </Link>
  )
}

export default Dot
