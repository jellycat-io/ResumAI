import { SubscriptionLevel } from "./subscription"

export function canCreateResume(
  subscriptionLevel: SubscriptionLevel,
  currentResumeCount: number,
) {
  const maxResumeMap: Record<SubscriptionLevel, number> = {
    free: 1,
    premium: 3,
    premium_plus: Infinity,
  }

  const maxResumes = maxResumeMap[subscriptionLevel]

  return currentResumeCount < maxResumes
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel !== "free"
}

export function canUseCustomization(subscriptionLevel: SubscriptionLevel) {
  return subscriptionLevel === "premium_plus"
}
