"use client"

import { useResumeBuilderStore } from "@/store/use-resume-builder-store"

import { cn } from "@/lib/utils"

import { BorderPicker } from "./border-picker"
import { ColorPicker } from "./color-picker"
import { RenderPreviewContent } from "./render-preview-content"

interface RenderPreviewProps {
  showDebug?: boolean
  className?: string
}

export function RenderPreview({ showDebug, className }: RenderPreviewProps) {
  const { resumeData } = useResumeBuilderStore()

  return (
    <section
      className={cn("group relative hidden w-full md:w-1/2 md:flex", className)}
    >
      <div className="absolute top-1 left-1 flex flex-col gap-3 flex-none lg:top-3 lg:left-3 opacity-50 xl:opacity-100 group-hover:opacity-100">
        <ColorPicker />
        <BorderPicker />
      </div>
      <div className="flex w-full flex-col items-center overflow-y-auto bg-secondary p-3">
        {showDebug && (
          <pre className="w-full bg-background text-foreground p-3 rounded-md mb-3">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        )}
        <RenderPreviewContent className="max-w-2xl shadow-md" />
      </div>
    </section>
  )
}
