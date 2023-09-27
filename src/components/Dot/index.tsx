import styles from "./index.module.css"
import { useParams, useNavigate } from "react-router-dom"
import clsx from "clsx"

type Props = {
  itemId: string | undefined
  expanded: boolean
  hasChildren: boolean
}

// Function to get the appropriate dot class based on the expanded and hasChildren properties
const getDotActive = (
  expanded: boolean,
  hasChildren: boolean
): string | null => {
  if (!expanded && hasChildren) {
    return styles.dot__active
  }
  return null
}

// Function to get the appropriate dot class based on the id and itemId properties
const getDotHidden = (id: string | undefined, itemId: string) => {
  if (id === itemId) {
    return styles.dot__hidden
  }
  return null
}

const Dot: React.FC<Props> = ({ itemId, expanded, hasChildren }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Function to navigate to a new ID
  const navigateToNewId = (newId: string) => {
    navigate(`/${newId}`)
  }

  if (!itemId) return null

  return (
    <div
      onClick={() => navigateToNewId(itemId)}
      className={clsx(
        styles.dot,
        getDotHidden(id, itemId),
        getDotActive(expanded, hasChildren)
      )}
    >
      &#8226;
    </div>
  )
}

export default Dot
