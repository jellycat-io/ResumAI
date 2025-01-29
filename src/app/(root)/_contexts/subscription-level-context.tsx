"use client"

import { createContext, useContext } from "react"

import { SubscriptionLevel } from "@/lib/subscription"

const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined,
)

interface SubscriptionLevelProviderProps {
  children: React.ReactNode
  subscriptionLevel: SubscriptionLevel
}

export function SubscriptionLevelProvider({
  children,
  subscriptionLevel,
}: SubscriptionLevelProviderProps) {
  return (
    <SubscriptionLevelContext.Provider value={subscriptionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  )
}

export function useSubscriptionLevel() {
  const context = useContext(SubscriptionLevelContext)
  if (context === undefined) {
    throw new Error(
      "useSubscriptionLevel must be used within a SubscriptionLevelProvider",
    )
  }

  return context
}
