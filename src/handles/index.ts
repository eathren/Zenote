import {
  getFirestore,
  collection,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage"
import { GraphNode, Graph } from "src/types/index"

const storage = getStorage()
const db = getFirestore()

export const addGraphInDB = async (graphName: string) => {
  const graphsCollection = collection(db, "graphs")
  const graph = {
    name: graphName,
    date_created: Date.now(),
  }
  try {
    const docRef = await addDoc(graphsCollection, graph)
    return docRef.id
  } catch (error) {
    console.error("Failed to add graph in DB:", error)
  }
}

export const getGraphsFromDB = async () => {
  const graphsCollection = collection(db, "graphs")
  const graphsSnapshot = await getDocs(graphsCollection)
  const graphs: Graph[] = []
  graphsSnapshot.forEach((doc) => {
    graphs.push(doc.data() as Graph)
  })
  return graphs
}

// Nodes

export const fetchMarkdown = async (nodeId: string) => {
  try {
    // Reference to storage bucket
    // Reference to file in storage
    const storageRef = ref(storage, `markdown/${nodeId}.md`)

    const url = await getDownloadURL(storageRef)

    // Fetch markdown content from the URL
    const response = await fetch(url)
    const text = await response.text()
    return text
  } catch (error) {
    console.error("Error fetching markdown:", error)
  }
}

export const uploadMarkdown = async (nodeId: string, markdown: string) => {
  const storageRef = ref(storage, `markdown/${nodeId}.md`)
  await uploadString(storageRef, markdown)
  const url = await getDownloadURL(storageRef)
  return url
}

export const deleteMarkdown = async (nodeId: string) => {
  const storageRef = ref(storage, `markdown/${nodeId}.md`)
  await deleteObject(storageRef)
}

export const getNodes = async (graphId: string) => {
  const nodesCollection = collection(db, "nodes")
  const q = query(nodesCollection, where("graphId", "==", graphId))
  const nodesSnapshot = await getDocs(q)
  const nodes: GraphNode[] = nodesSnapshot.docs.map((doc) => ({
    ...(doc.data() as GraphNode),
    id: doc.id,
  }))
  return nodes
}

export const addNode = async (graphId: string, nodeName: string) => {
  // Get a reference to the Firestore 'nodes' collection
  const nodesCollection = collection(db, "nodes")

  // Generate the initial Markdown content and upload it, retrieving the generated URL
  const markdownContent = `# ${nodeName}`

  // Create a new node object with default values
  const newNode = {
    name: nodeName || "Untitled",
    graphId,
  }

  // Add the new node to the Firestore 'nodes' collection
  const docRef = await addDoc(nodesCollection, newNode)

  // Generate a unique Markdown file name based on the Firestore-generated ID for the new node
  const markdownUrl = await uploadMarkdown(docRef.id, markdownContent)

  // Update the Firestore document with the new Markdown file name and URL
  const nodeDoc = doc(db, "nodes", docRef.id)
  await setDoc(nodeDoc, { markdownUrl }, { merge: true })

  // Return the generated Firestore ID for the new node
  return docRef.id
}

export const updateNode = async (
  nodeId: string,
  name: string,
  markdown: string
) => {
  const nodeRef = doc(db, "nodes", nodeId)

  const markdownUrl = await uploadMarkdown(name, markdown) // Upload new Markdown and get URL

  await updateDoc(nodeRef, {
    name,
    markdownUrl,
  })
}

export const updateNodeTitle = async (nodeId: string, newTitle: string) => {
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    name: newTitle,
  })
}

export const deleteNode = async (nodeId: string) => {
  const nodeRef = doc(db, "nodes", nodeId)

  await deleteMarkdown(nodeId) // Delete Markdown content

  await deleteDoc(nodeRef)
}

export const addEdge = async (
  graphId: string,
  source: string,
  target: string
) => {
  if (!graphId || !source || !target) return
  // Get a reference to the Firestore 'edges' collection
  const edgesCollection = collection(db, "edges")

  // Check if the edge already exists
  const q = query(
    edgesCollection,
    where("graphId", "==", graphId),
    where("source", "==", source),
    where("target", "==", target)
  )

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    // If the edge doesn't exist, create it
    const newEdge = {
      graphId,
      source,
      target,
    }

    // Add the new edge to the Firestore 'edges' collection
    await addDoc(edgesCollection, newEdge)
  }
}

export const deleteEdge = async (source: string, target: string) => {
  const edgesCollection = collection(db, "edges")
  const q = query(
    edgesCollection,
    where("source", "==", source),
    where("target", "==", target)
  )

  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    // If the edge exists, delete it
    querySnapshot.forEach(async (documentSnapshot) => {
      await deleteDoc(doc(edgesCollection, documentSnapshot.id))
    })
  }
}
