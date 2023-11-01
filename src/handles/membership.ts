import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { db } from "src/firebase"
import { GraphMembership } from "src/types"
import { handleOperation } from "./utils"

export const addGraphMembership = async (
  graphId: string,
  membership: GraphMembership
) => {
  return await handleOperation(async () => {
    await setDoc(doc(db, "memberships", graphId), membership)
  })
}

export const getmembershipsByUserId = async (userId: string) => {
  return await handleOperation(async () => {
    const membershipQuery = query(
      collection(db, "memberships"),
      where("userId", "==", userId)
    )
    const membershipSnapshot = await getDocs(membershipQuery)
    return membershipSnapshot.docs.map((doc) => doc.data() as GraphMembership)
  })
}

export const getGraphMembershipById = async (membershipId: string) => {
  return await handleOperation(async () => {
    const docSnapshot = await getDoc(doc(db, "memberships", membershipId))
    if (docSnapshot.exists()) {
      return docSnapshot.data() as GraphMembership
    } else {
      throw new Error("Membership not found")
    }
  })
}

export const updateGraphMembership = async (
  membershipId: string,
  updatedFields: Partial<GraphMembership>
) => {
  return await handleOperation(async () => {
    const membershipRef = doc(db, "memberships", membershipId)
    await updateDoc(membershipRef, updatedFields)
  })
}

export const deleteGraphMembership = async (membershipId: string) => {
  return await handleOperation(async () => {
    const membershipRef = doc(db, "memberships", membershipId)
    await deleteDoc(membershipRef)
  })
}
