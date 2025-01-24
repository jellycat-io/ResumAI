"use client"

import { useResumeBuilderStore } from "@/store/use-resume-builder-store"

import { RenderPreviewContent } from "./render-preview-content"

interface RenderPreviewProps {
  showDebug?: boolean
}

export function RenderPreview({ showDebug }: RenderPreviewProps) {
  const { resumeData, setResumeData } = useResumeBuilderStore()

  return (
    <section className="hidden w-1/2 md:flex">
      <div className="flex w-full flex-col items-center overflow-y-auto bg-secondary p-3">
        {showDebug && (
          <pre className="w-full bg-background text-foreground p-3 rounded-md mb-3">
            {JSON.stringify(resumeData, null, 2)}
          </pre>
        )}
        <RenderPreviewContent
          resumeData={resumeData}
          setResumeData={setResumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </section>
  )
}
