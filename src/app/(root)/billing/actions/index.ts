"use server"

import { currentUser } from "@clerk/nextjs/server"

import { env } from "@/lib/env"
import { stripe } from "@/lib/stripe"

export async function createCustomerPortalSession() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined
  if (!stripeCustomerId) throw new Error("Stripe customer ID not found.")

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_URL}/billing`,
  })

  if (!session.url) throw new Error("Failed to create customer portal session.")

  return session.url
}
