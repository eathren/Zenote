import { useState, useEffect } from "react"

type UseForwardHistoryOptions = {
  enable?: boolean
}

export const useForwardHistory = ({
  enable = true,
}: UseForwardHistoryOptions = {}) => {
  const [hasForwardHistory, setHasForwardHistory] = useState(false)

  useEffect(() => {
    if (!enable) {
      return
    }

    const updateForwardHistoryState = () => {
      setHasForwardHistory(window.history.length > 1)
    }

    window.addEventListener("popstate", updateForwardHistoryState)

    return () => {
      window.removeEventListener("popstate", updateForwardHistoryState)
    }
  }, [enable])

  return { hasForwardHistory }
}
