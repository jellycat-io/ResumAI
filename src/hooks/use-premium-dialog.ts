import { create } from "zustand"

interface PremiumDialogState {
  open: boolean
  setOpen: (open: boolean) => void
}

export const usePremiumDialog = create<PremiumDialogState>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}))
