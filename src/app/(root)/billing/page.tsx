import { Metadata } from "next"

import { formatDate } from "date-fns"
import Stripe from "stripe"

import { getSubscription } from "../actions"
import { GetSubscriptionButton } from "./_components/get-subscription-button"
import { ManageSubscriptionButton } from "./_components/manage-subscription-button"

export const metadata: Metadata = {
  title: "Billing",
}

export default async function BillingPage() {
  const { subscription, priceInfo } = await getSubscription()

  return (
    <main className="max-w-7xl mx-auto w-full min-h-screen space-y-6 p-6">
      <h1 className="text-3xl font-bold">Billing</h1>
      <p>
        Your current plan:{" "}
        <span className="font-bold">
          {priceInfo ? (priceInfo.product as Stripe.Product).name : "Free"}
        </span>
      </p>
      {subscription ? (
        <>
          {subscription.stripeCancelAtPeriodEnd && (
            <p className="text-destructive">
              Your subscription will be canceled on{" "}
              {formatDate(subscription.stripeCurrentPeriodEnd, "MMMM dd, yyyy")}
            </p>
          )}
          <ManageSubscriptionButton />
        </>
      ) : (
        <GetSubscriptionButton />
      )}
    </main>
  )
}
