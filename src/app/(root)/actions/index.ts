"use server"

import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs/server"

import { env } from "@/lib/env"
import { stripe } from "@/lib/stripe"

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined

  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    metadata: {
      userId: user.id,
    },
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

export async function getSubscription() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const subscription = await db.userSubscription.findUnique({
    where: {
      userId: user.id,
    },
  })

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription?.stripePriceId, {
        expand: ["product"],
      })
    : null

  return {
    subscription,
    priceInfo,
  }
}
