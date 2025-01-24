import { Suspense } from "react"
import { Metadata } from "next"

import { ResumeBuilder } from "./_components/resume-builder"

export const metadata: Metadata = {
  title: "Builder",
}

export default function BuilderPage() {
  return (
    <Suspense>
      <ResumeBuilder />
    </Suspense>
  )
}
