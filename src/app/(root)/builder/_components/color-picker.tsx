"use client"

import { useState } from "react"

import { PaintbrushIcon } from "lucide-react"

import { canUseCustomization } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { usePremiumDialog } from "@/hooks/use-premium-dialog"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useResumeData } from "../_contexts/resume-data-context"
import { useSubscriptionLevel } from "../../_contexts/subscription-level-context"
import { COLORS } from "../../constants"

export function ColorPicker() {
  const [open, setOpen] = useState(false)
  const { resumeData, setResumeData } = useResumeData()
  const subscriptionLevel = useSubscriptionLevel()
  const { setPremiumDialogOpen } = usePremiumDialog()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (canUseCustomization(subscriptionLevel)) {
              setOpen(true)
            } else {
              setPremiumDialogOpen(true)
            }
          }}
        >
          <PaintbrushIcon className="size-4" />
          <span className="sr-only">Color Picker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xl flex flex-wrap gap-2">
        {Object.entries(COLORS).map(([key, value]) => (
          <button
            key={key}
            aria-label={`color-${key}`}
            className={cn(
              "rounded-full size-6 cursor-pointer border border-white-[0.05]",
              resumeData.colorHex === value && "ring-2 ring-ring border-0",
            )}
            style={{
              backgroundColor: value,
            }}
            onClick={() => {
              setResumeData({ ...resumeData, colorHex: value })
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  )
}
