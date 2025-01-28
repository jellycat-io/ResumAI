"use client"

import { useState } from "react"

import { CheckIcon } from "lucide-react"

import { usePremiumDialog } from "@/hooks/use-premium-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingButton } from "@/components/loading-button"

import { createCheckoutSession } from "../actions"

const PREMIUM_FEATURES = ["Ai resume tools", "Up to 3 resumes"]
const PREMIUM_PLUS_FEATURES = [
  "Ai resume tools",
  "Infinite resumes",
  "Cover letter generator",
  "Resume customization",
]

export function PremiumDialog() {
  const [loading, setLoading] = useState(false)
  const { open, setOpen } = usePremiumDialog()
  const { toast } = useToast()

  async function handlePremiumClick(priceId: string) {
    try {
      setLoading(true)
      const checkoutUrl = await createCheckoutSession(priceId)
      window.location.href = checkoutUrl
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        description: "Something went wrong... Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) {
          setOpen(open)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ResumAI Premium</DialogTitle>
          <DialogDescription>
            Get a premium subscription to unlock more features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-stretch">
            <div className="flex flex-col justify-between space-y-5 w-1/2">
              <div className="space-y-5">
                <h3 className="text-center text-lg font-bold">Premium</h3>
                <ul className="space-y-2">
                  {PREMIUM_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <LoadingButton
                loading={loading}
                onClick={() =>
                  handlePremiumClick(
                    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY!,
                  )
                }
              >
                Get Premium
              </LoadingButton>
            </div>
            <div className="mx-6 border-l" />
            <div className="flex flex-col justify-between space-y-5 w-1/2">
              <div className="space-y-5">
                <h3 className="text-center text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Premium Plus
                </h3>
                <ul className="space-y-2">
                  {PREMIUM_PLUS_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="size-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <LoadingButton
                variant="premium"
                loading={loading}
                onClick={() =>
                  handlePremiumClick(
                    process.env
                      .NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_PLUS_MONTHLY!,
                  )
                }
              >
                Get Premium Plus
              </LoadingButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
