import { Metadata } from "next"
import Link from "next/link"

import { FilePlus2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ResumeItem } from "./_components/resume-item"
import { getResumeSummaries } from "./actions"

export const metadata: Metadata = {
  title: "Your resumes",
}

export default async function ResumesPage() {
  const { resumes, totalCount } = await getResumeSummaries()

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-6">
      <Button asChild className="mx-auto flex w-fit">
        <Link href="/editor">
          <FilePlus2Icon className="size-4" />
          New resume
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your resumes</h1>
        <p>Total: {totalCount}</p>
      </div>
      <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-6">
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
      </div>
    </main>
  )
}
