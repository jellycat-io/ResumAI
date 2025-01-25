import { Suspense } from "react"
import { Metadata } from "next"

import { ResumeBuilder } from "./_components/resume-builder"
import { getResume } from "./actions"

export const metadata: Metadata = {
  title: "Builder",
}

interface BuilderPageProps {
  searchParams: Promise<{ resumeId?: string }>
}

export default async function BuilderPage({ searchParams }: BuilderPageProps) {
  const { resumeId } = await searchParams
  const resume = await getResume(resumeId)

  return (
    <Suspense>
      <ResumeBuilder resume={resume} />
    </Suspense>
  )
}
