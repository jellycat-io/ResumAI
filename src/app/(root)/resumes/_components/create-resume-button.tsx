"use client"

import Link from "next/link"

import { FilePlus2Icon } from "lucide-react"

import { usePremiumDialog } from "@/hooks/use-premium-dialog"
import { Button } from "@/components/ui/button"

interface CreateResumeButtonProps {
  canCreate?: boolean
}

export function CreateResumeButton({ canCreate }: CreateResumeButtonProps) {
  const { setOpen } = usePremiumDialog()

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit">
        <Link href="/builder">
          <FilePlus2Icon className="size-4" />
          New Resume
        </Link>
      </Button>
    )
  }

  return (
    <Button className="mx-auto flex w-fit" onClick={() => setOpen(true)}>
      <FilePlus2Icon className="size-4" />
      New Resume
    </Button>
  )
}
