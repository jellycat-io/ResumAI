"use client"

import { CircleIcon, SquareIcon, SquircleIcon } from "lucide-react"

import { canUseCustomization } from "@/lib/permissions"
import { usePremiumDialog } from "@/hooks/use-premium-dialog"
import { Button } from "@/components/ui/button"

import { useResumeData } from "../_contexts/resume-data-context"
import { useSubscriptionLevel } from "../../_contexts/subscription-level-context"
import { BORDER_STYLES } from "../../constants"

const borderStyles = Object.values(BORDER_STYLES)

export function BorderPicker() {
  const subscriptionLevel = useSubscriptionLevel()
  const { setPremiumDialogOpen } = usePremiumDialog()
  const { resumeData, setResumeData } = useResumeData()
  const { borderStyle } = resumeData

  function handleClick() {
    if (!canUseCustomization(subscriptionLevel)) {
      setPremiumDialogOpen(true)
      return
    }

    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0
    const nextIndex = (currentIndex + 1) % borderStyles.length

    setResumeData({ ...resumeData, borderStyle: borderStyles[nextIndex] })
  }

  const Icon =
    borderStyle === "square"
      ? SquareIcon
      : borderStyle === "circle"
        ? CircleIcon
        : SquircleIcon

  return (
    <Button
      variant="outline"
      size="icon"
      title="Select border style"
      onClick={handleClick}
    >
      <Icon className="size-4" />
    </Button>
  )
}
