import { useRef } from "react"

import { cn } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { useDimensions } from "@/hooks/use-dimensions"

interface RenderPreviewContentProps {
  resumeData: ResumeValues
  setResumeData: (data: ResumeValues) => void
  className?: string
}

export function RenderPreviewContent({
  resumeData,
  setResumeData,
  className,
}: RenderPreviewContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useDimensions(containerRef)

  return (
    <div
      className={cn(
        "w-full h-fit aspect-[210/297] bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <h1 className="p-6 text-3xl font-bold">Hello World!</h1>
      </div>
    </div>
  )
}
