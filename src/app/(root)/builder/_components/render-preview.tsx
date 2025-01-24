"use client"

import { useResumeBuilderStore } from "@/store/use-resume-builder-store"

import { ColorPicker } from "./color-picker"
import { RenderPreviewContent } from "./render-preview-content"

interface RenderPreviewProps {
  showDebug?: boolean
}

export function RenderPreview({ showDebug }: RenderPreviewProps) {
  const { resumeData } = useResumeBuilderStore()

  return (
    <section className="relative hidden w-1/2 md:flex">
      <div className="absolute top-1 left-1 flex flex-col gap-3 flex-none lg:top-3 lg:left-3">
        <ColorPicker />
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
