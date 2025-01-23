"use client"

import Link from "next/link"

import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function ResumeBuilder() {
  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute inset-0 flex w-full">
          <section className="w-full md:w-1/2">Left</section>
          <Separator orientation="vertical" className="grow" />
          <section className="hidden w-1/2 md:flex">Right</section>
        </div>
      </main>
      <footer className="w-full border-t px-3 py-5">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline">Previous step</Button>
            <Button>Next step</Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/resumes">Close</Link>
            </Button>
            <div className="flex items-center gap-2 opacity-0">
              <Loader2Icon className="size-4 animate-spin" />
              <p className="text-muted-foreground text-sm">Saving...</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
