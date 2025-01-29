import { create } from "zustand"

interface PremiumDialogState {
  openPremiumDialog: boolean
  setPremiumDialogOpen: (open: boolean) => void
}

export const usePremiumDialog = create<PremiumDialogState>((set) => ({
  openPremiumDialog: false,
  setPremiumDialogOpen: (open: boolean) => set({ openPremiumDialog: open }),
}))
