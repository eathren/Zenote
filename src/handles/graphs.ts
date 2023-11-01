import {
  getFirestore,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  collection,
  runTransaction,
  where,
} from "firebase/firestore"
import {
  Graph,
  GraphMembership,
  GraphPermission,
  GraphPrivacySetting,
} from "src/types/index"
import {
  getCurrentUserId,
  getGraphsCollectionRef,
  getNodeCollectionPath,
  handleOperation,
} from "./utils"
import { deleteMarkdown } from "./markdown"
import { addGraphMembership, deleteGraphMembership } from "./membership"

const db = getFirestore()

export const addGraphInDB = async (graphName: string) => {
  return await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    const graphsCollectionRef = collection(db, "graphs")
    const graph: Graph = {
      name: graphName,
      ownerId,
      date_created: Date.now(),
      nodes: {},
      type: GraphPrivacySetting.Private,
    }
    const docRef = await addDoc(graphsCollectionRef, graph)
    const graphId = docRef.id
    const membership: GraphMembership = {
      graphId,
      userId: ownerId,
      permission: GraphPermission.Owner,
    }
    await addGraphMembership(graphId, membership)
    return docRef.id
  })
}

export const addTeamGraphInDB = async (graphName: string, teamId: string) => {
  await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    const graphsCollectionRef = getGraphsCollectionRef(db)
    const graph: Graph = {
      name: graphName,
      ownerId,
      date_created: Date.now(),
      type: GraphPrivacySetting.Team,
      teamId,
    }
    await addDoc(graphsCollectionRef, graph)
  })
}

export const addGlobalGraphInDB = async (graphName: string) => {
  await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    const graphsCollectionRef = getGraphsCollectionRef(db)
    const graph: Graph = {
      name: graphName,
      ownerId,
      date_created: Date.now(),
      type: GraphPrivacySetting.Global,
    }
    await addDoc(graphsCollectionRef, graph)
  })
}

// Function to get all graphs from the database where user has a membership
export const getGraphsFromDB = async () => {
  return await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string

    // Step 1: Fetch all memberships for the user
    const membershipCollectionRef = collection(db, `memberships`)
    const membershipQuery = query(
      membershipCollectionRef,
      where("userId", "==", ownerId)
    )
    const membershipSnapshot = await getDocs(membershipQuery)
    const activeGraphIds: string[] = []

    membershipSnapshot.forEach((doc) => {
      const membershipData = doc.data() as GraphMembership
      activeGraphIds.push(membershipData.graphId)
    })

    // Step 2: Fetch graphs based on memberships
    const graphsCollectionRef = getGraphsCollectionRef(db)
    const graphsSnapshot = await getDocs(graphsCollectionRef)
    const graphs: Graph[] = []

    graphsSnapshot.forEach((doc) => {
      const graphData = doc.data() as Graph
      if (activeGraphIds.includes(doc.id)) {
        graphs.push(graphData)
      }
    })

    return graphs
  })
}

export const deleteGraph = async (graphId: string) => {
  await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    await runTransaction(db, async (transaction) => {
      const graphRef = doc(db, `graphs`, graphId)
      transaction.delete(graphRef)

      const nodeQuery = query(
        collection(db, getNodeCollectionPath(ownerId, graphId))
      )
      const nodeSnapshot = await getDocs(nodeQuery)
      nodeSnapshot.forEach((doc) => {
        deleteMarkdown(doc.id)
        transaction.delete(doc.ref)
      })

      // this is passing something wrong
      await deleteGraphMembership(graphId)
    })
  })
}

export const updateGraphNodes = async (
  graphId: string,
  nodeId: string,
  nodeName: string,
  operation: "add" | "delete" | "update"
) => {
  await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    const graphRef = doc(db, `graphs`, graphId)
    const graphDoc = await getDoc(graphRef)

    if (graphDoc.exists()) {
      const graphData = graphDoc.data() as Graph
      const nodes = graphData.nodes ?? {}

      if (operation === "add" || operation === "update") {
        nodes[nodeId] = nodeName
      } else if (operation === "delete") {
        delete nodes[nodeId]
      }

      await updateDoc(graphRef, {
        nodes,
      })
    }
  })
}

export const updateGraphFavoriteStatus = async (
  graphId: string | undefined
) => {
  await handleOperation(async () => {
    const ownerId = getCurrentUserId() as string
    const graphRef = doc(db, `graphs`, graphId as string)
    const graphDoc = await getDoc(graphRef)

    if (graphDoc.exists()) {
      const graphData = graphDoc.data() as Graph
      const newStatus =
        graphData.isFavorite === undefined ? true : !graphData.isFavorite

      await updateDoc(graphRef, {
        isFavorite: newStatus,
      })
    }
  })
}
