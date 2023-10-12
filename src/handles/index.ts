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
  getDoc,
} from "firebase/firestore"
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage"
import { GraphNode, Graph, GraphEdge } from "src/types/index"
import { notification } from "antd"
import { v4 as uuidv4 } from "uuid"
const storage = getStorage()
const db = getFirestore()

// Graphs
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
    notification.error({
      message: "Error",
      description: "Failed to add graph in DB",
    })
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

export const deleteGraph = async (graphId: string) => {
  try {
    const graphRef = doc(db, "graphs", graphId)
    await deleteDoc(graphRef)

    // Delete all nodes and edges related to this graph
    const nodes = await getNodes(graphId)
    nodes.forEach(async (node) => {
      await deleteNode(node.id)
    })
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete graph",
    })
  }
}

// Nodes
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

export const fetchNode = async (nodeId: string) => {
  const nodeRef = doc(db, "nodes", nodeId)
  const nodeDoc = await getDoc(nodeRef)
  const node = { id: nodeRef.id, ...nodeDoc.data() } as GraphNode
  return node
}

export const addNode = async (graphId: string, nodeName: string) => {
  const nodesCollection = collection(db, "nodes")
  const newNode = {
    name: nodeName,
    graphId,
    date_created: Date.now(),
    tags: [],
    groups: [],
    edges: [],
  }
  const docRef = await addDoc(nodesCollection, newNode)
  const markdownUrl = await uploadMarkdown(docRef.id, `# ${nodeName}`)
  const nodeDoc = doc(db, "nodes", docRef.id)
  await setDoc(nodeDoc, { markdownUrl }, { merge: true })
  return docRef.id
}

export const updateNode = async (
  nodeId: string,
  name: string,
  markdown: string,
  edges: GraphEdge[],
  tags: string[],
  groups: string[]
) => {
  const nodeRef = doc(db, "nodes", nodeId)
  const markdownUrl = await uploadMarkdown(nodeId, markdown)
  await updateDoc(nodeRef, {
    name,
    markdownUrl,
    edges,
    tags,
    groups,
  })
}

export const updateNodeTitle = async (nodeId: string, newTitle: string) => {
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    name: newTitle,
  })
}

export const updateNodeTags = async (nodeId: string, tags: string[]) => {
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    tags,
  })
}

export const updateNodeGroups = async (nodeId: string, groups: string[]) => {
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    groups,
  })
}

export const deleteNode = async (nodeId: string) => {
  try {
    const nodeRef = doc(db, "nodes", nodeId)

    // Delete associated edges
    const edgesCollection = collection(db, "edges")
    const q1 = query(edgesCollection, where("source", "==", nodeId))
    const q2 = query(edgesCollection, where("target", "==", nodeId))
    const querySnapshot1 = await getDocs(q1)
    const querySnapshot2 = await getDocs(q2)

    querySnapshot1.forEach(async (documentSnapshot) => {
      await deleteDoc(doc(edgesCollection, documentSnapshot.id))
    })

    querySnapshot2.forEach(async (documentSnapshot) => {
      await deleteDoc(doc(edgesCollection, documentSnapshot.id))
    })

    // Delete markdown
    await deleteMarkdown(nodeId)

    // Delete node
    await deleteDoc(nodeRef)
  } catch (error) {
    notification.error({
      message: "Error",
      description: "Failed to delete node",
    })
  }
}

// Fetches a single document by its ID and collection
const fetchSingleDoc = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const addEdgeToNode = async (
  graphId: string,
  nodeId: string,
  targetNodeId: string
) => {
  const nodeData = (await fetchSingleDoc("nodes", nodeId)) as GraphNode // Fetch single node

  const newEdge = {
    id: uuidv4(),
    graphId,
    source: nodeId,
    target: targetNodeId,
    date_created: Date.now(),
  }

  // Check if nodeData.edges is defined and is an array
  if (!Array.isArray(nodeData.edges)) {
    nodeData.edges = []
  }

  // Push the new edge into the edges array
  nodeData.edges.push(newEdge)

  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    edges: nodeData.edges,
  })
}
export const removeEdgeFromNode = async (
  nodeId: string,
  targetNodeId: string
) => {
  const nodeData = (await fetchSingleDoc("nodes", nodeId)) as GraphNode // fetch single node
  const newEdges = nodeData.edges?.filter(
    (edge) => edge.target !== targetNodeId
  )
  const nodeRef = doc(db, "nodes", nodeId)
  await updateDoc(nodeRef, {
    edges: newEdges,
  })
}
