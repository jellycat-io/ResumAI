import { Metadata } from "next"
import Link from "next/link"

import { FilePlus2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Your resumes",
}

export default function ResumesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <Button asChild className="mx-auto flex w-fit">
        <Link href="/editor">
          <FilePlus2Icon className="size-4" />
          New resume
        </Link>
      </Button>
    </main>
  )
}
