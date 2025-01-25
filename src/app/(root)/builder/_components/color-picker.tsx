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

const COLORS = {
  black: "#000000",
  crust: "#232634",
  rosewater: "#f2d5cf",
  flamingo: "#eebebe",
  pink: "#f4b8e4",
  mauve: "#ca9ee6",
  red: "#e78284",
  maroon: "#ea999c",
  peach: "#ef9f76",
  yellow: "#e5c890",
  green: "#a6d189",
  teal: "#81c8be",
  sky: "#99d1db",
  sapphire: "#85c1dc",
  blue: "#8caaee",
  lavender: "#babbf1",
}

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
