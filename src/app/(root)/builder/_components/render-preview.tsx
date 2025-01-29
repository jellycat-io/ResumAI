"use client"

import { cn, fileReplacer } from "@/lib/utils"

import { useResumeData } from "../_contexts/resume-data-context"
import { ResumePreview } from "../../_components/resume-preview"
import { BorderPicker } from "./border-picker"
import { ColorPicker } from "./color-picker"

interface RenderPreviewProps {
  showDebug?: boolean
  className?: string
}

export function RenderPreview({ showDebug, className }: RenderPreviewProps) {
  const { resumeData } = useResumeData()

  return (
    <section
      className={cn("group relative hidden w-full md:w-1/2 md:flex", className)}
    >
      <div className="absolute top-1 left-1 flex flex-col gap-3 flex-none lg:top-3 lg:left-3 opacity-50 xl:opacity-100 group-hover:opacity-100 transition-opacity">
        <ColorPicker />
        <BorderPicker />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary/60 p-3">
        {showDebug && (
          <pre className="w-full bg-background text-foreground p-3 rounded-md mb-3">
            {JSON.stringify(resumeData, fileReplacer, 2)}
          </pre>
        )}
        <ResumePreview
          className="max-w-2xl shadow-md"
          resumeData={resumeData}
        />
      </div>
    </section>
  )
}
