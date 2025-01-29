"use server"

import { currentUser } from "@clerk/nextjs/server"

import { env } from "@/lib/env"
import { stripe } from "@/lib/stripe"

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_URL}/billing`,
    customer_email: user.emailAddresses[0].emailAddress,
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read ResumAI's [terms of service](${env.NEXT_PUBLIC_URL}/tos) and agree to them.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  })

  if (!session.url) throw new Error("Failed to crerate checkout session")

  return session.url
}
