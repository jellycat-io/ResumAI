import { auth } from "@clerk/nextjs/server"

import { getUserSubscriptionLevel } from "@/lib/subscription"

import { Navbar } from "./_components/navbar"
import { PremiumDialog } from "./_components/premium-dialog"
import { SubscriptionLevelProvider } from "./_contexts/subscription-level-context"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const subscriptionLevel = await getUserSubscriptionLevel(userId)

  return (
    <SubscriptionLevelProvider subscriptionLevel={subscriptionLevel}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
        <PremiumDialog />
      </div>
    </SubscriptionLevelProvider>
  )
}
