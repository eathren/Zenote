// markdown.ts
import {
  getStorage,
  ref,
  uploadString,
  updateMetadata,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { getAuth } from "firebase/auth"
import { notification } from "antd"

const storage = getStorage()
const auth = getAuth()

export const fetchMarkdown = async (nodeId: string) => {
  try {
    const storageRef = ref(storage, `markdown/${nodeId}.md`)
    const url = await getDownloadURL(storageRef)
    const response = await fetch(url)
    const text = await response.text()
    return text
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to fetch markdown",
    })
  }
}

export const uploadMarkdown = async (nodeId: string, markdown: string) => {
  const storageRef = ref(storage, `markdown/${nodeId}.md`)
  const currentUser = auth.currentUser
  const metadata = {
    contentType: "text/markdown",
    customMetadata: {
      ownerId: currentUser ? currentUser.uid : "unknown",
    },
  }
  await uploadString(storageRef, markdown)
  await updateMetadata(storageRef, metadata)
  const url = await getDownloadURL(storageRef)
  return url
}

export const deleteMarkdown = async (nodeId: string) => {
  const storageRef = ref(storage, `markdown/${nodeId}.md`)
  await deleteObject(storageRef)
}
