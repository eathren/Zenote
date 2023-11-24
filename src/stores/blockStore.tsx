import { Block } from "src/types/blocks"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type BlockState = {
  blocks: Record<string, Block>
  setBlocks: (blocks: Record<string, Block>) => void
  addBlock: (block: Block) => void
  removeBlock: (blockId: string) => void
  updateBlock: (block: Block) => void
}

export const useBlockStore = create<BlockState>()(
  persist<BlockState>(
    (set) => ({
      blocks: {},
      setBlocks: (blocks) => set({ blocks }),
      addBlock: (block) =>
        set((state) => ({
          blocks: { ...state.blocks, [block.id]: block },
        })),
      removeBlock: (blockId) =>
        set((state) => {
          const { [blockId]: _, ...blocks } = state.blocks
          return { blocks }
        }),
      updateBlock: (block) =>
        set((state) => ({
          blocks: { ...state.blocks, [block.id]: block },
        })),
    }),
    {
      name: "block-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
