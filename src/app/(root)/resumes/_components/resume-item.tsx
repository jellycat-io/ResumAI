import Link from "next/link"

import { formatDate } from "date-fns"

import { toResumeValues } from "@/lib/mappings"
import { ResumeServerData } from "@/lib/types"

import { ResumePreview } from "../../_components/resume-preview"

interface ResumeItemProps {
  resume: ResumeServerData
}

export function ResumeItem({ resume }: ResumeItemProps) {
  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className="group relative border border-transparent hover:border-primary rounded-lg transition-colors bg-secondary p-3">
      <div className="space-y-3">
        <Link
          href={`/builder?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="font-semibold line-clamp-1">
            {resume.title ?? "No title"}
          </p>
          <p className="line-clamp-2 text-sm">
            {resume.description ?? "(You should add one)"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {`${wasUpdated ? "Updated" : "Created"} on ${formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}`}
          </p>
        </Link>
        <Link
          href={`/builder?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
          <ResumePreview
            resumeData={toResumeValues(resume)}
            className="w-full overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
    </div>
  )
}
