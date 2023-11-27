import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"
import { db } from "src/firebase"
import { BlockType, Block } from "src/types/blocks"
import { handleOperation } from "./utils"

export const createNewBlock = async (
  graphId: string,
  nodeId: string,
  blockType: BlockType
): Promise<string> => {
  const blocksCollectionPath = `graphs/${graphId}/nodes/${nodeId}/blocks`
  const blocksCollection = collection(db, blocksCollectionPath)
  const blockDocRef = doc(blocksCollection)
  const blockId = blockDocRef.id

  const newBlock: Block = {
    id: blockId,
    type: blockType,
    content: [],
    properties: {},
    parent: nodeId,
  }

  const batch = writeBatch(db)
  batch.set(blockDocRef, newBlock)
  await batch.commit()

  return blockId
}

export const updateParentBlockContent = async (
  graphId: string,
  nodeId: string,
  parentBlockId: string,
  newBlockId: string,
  insertIndex?: number
): Promise<void> => {
  const parentBlockDocRef = doc(
    db,
    `graphs/${graphId}/nodes/${nodeId}/blocks`,
    parentBlockId
  )
  const parentBlockDoc = await getDoc(parentBlockDocRef)

  if (parentBlockDoc.exists()) {
    const parentBlockData = parentBlockDoc.data() as Block
    const updatedContent = [...parentBlockData.content]
    if (typeof insertIndex === "number") {
      updatedContent.splice(insertIndex, 0, newBlockId) // Insert at specified index
    } else {
      updatedContent.push(newBlockId) // Add to the end if no index specified
    }
    await updateDoc(parentBlockDocRef, { content: updatedContent })
  }
}

export const createBlock = async (
  graphId: string,
  nodeId: string,
  blockType: BlockType,
  parentBlockId?: string,
  insertIndex?: number
) => {
  const blockId = await createNewBlock(graphId, nodeId, blockType, [], {})
  if (parentBlockId) {
    await updateParentBlockContent(
      graphId,
      nodeId,
      parentBlockId,
      blockId,
      insertIndex
    )
  }
  return blockId
}

export const updateBlock = async (
  graphId: string,
  nodeId: string,
  blockId: string,
  newContent: string
) => {
  return await handleOperation(async () => {
    const blockDocRef = doc(
      db,
      `graphs/${graphId}/nodes/${nodeId}/blocks`,
      blockId
    )
    await updateDoc(blockDocRef, { content: newContent })
  })
}

export const fetchBlock = async (
  graphId: string,
  nodeId: string,
  blockId: string
) => {
  return await handleOperation(async () => {
    const blockDocRef = doc(
      db,
      `graphs/${graphId}/nodes/${nodeId}/blocks`,
      blockId
    )
    const blockDoc = await getDoc(blockDocRef)

    if (!blockDoc.exists()) {
      throw new Error("Block not found")
    }

    return blockDoc.data()
  })
}

export const deleteBlock = async (
  graphId: string,
  nodeId: string,
  blockId: string
) => {
  return await handleOperation(async () => {
    const blockDocRef = doc(
      db,
      `graphs/${graphId}/nodes/${nodeId}/blocks`,
      blockId
    )
    await deleteDoc(blockDocRef)
  })
}
