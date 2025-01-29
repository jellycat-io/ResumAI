import { NextRequest, NextResponse } from "next/server"

import { clerkClient } from "@clerk/nextjs/server"
import Stripe from "stripe"

import { env } from "@/lib/env"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return new NextResponse("Signature is missing", { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    )

    console.log(`Received event: ${event.type}`, event.data.object)

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break
      default:
        console.warn(`Unhandled event type: ${event.type}`)
    }

    return new NextResponse("Event received", { status: 200 })
  } catch (e) {
    console.error(e)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    throw new Error("User ID is missing in session metadata.")
  }

  ;(await clerkClient()).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  })
}

async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  console.log("handleSubscriptionCreatedOrUpdated")
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("handleSubscriptionDeleted")
}
