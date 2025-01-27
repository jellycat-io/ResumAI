"use client"

import { CircleIcon, SquareIcon, SquircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useResumeData } from "../_context/_resume-data-context"
import { BORDER_STYLES } from "../../constants"

const borderStyles = Object.values(BORDER_STYLES)

export function BorderPicker() {
  const { resumeData, setResumeData } = useResumeData()
  const { borderStyle } = resumeData

  function handleClick() {
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
