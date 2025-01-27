"use client"

import { PaintbrushIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useResumeData } from "../_context/_resume-data-context"
import { COLORS } from "../../constants"

export function ColorPicker() {
  const { resumeData, setResumeData } = useResumeData()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
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
