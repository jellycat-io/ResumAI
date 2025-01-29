"use client"

import { useState } from "react"

import { useToast } from "@/hooks/use-toast"
import { LoadingButton } from "@/components/loading-button"

import { createCustomerPortalSession } from "../actions"

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleClick() {
    try {
      setLoading(true)
      const redirectUrl = await createCustomerPortalSession()
      window.location.href = redirectUrl
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
    <LoadingButton loading={loading} onClick={handleClick}>
      Manage Subscription
    </LoadingButton>
  )
}
