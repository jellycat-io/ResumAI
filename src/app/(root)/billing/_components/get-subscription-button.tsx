"use client"

import { usePremiumDialog } from "@/hooks/use-premium-dialog"
import { Button } from "@/components/ui/button"

export function GetSubscriptionButton() {
  const { setPremiumDialogOpen } = usePremiumDialog()

  return (
    <Button variant="premium" onClick={() => setPremiumDialogOpen(true)}>
      Get Premium Subscription
    </Button>
  )
}
