"use client"

import { useRef, useTransition } from "react"
import Link from "next/link"

import { formatDate } from "date-fns"
import { MoreHorizontalIcon, PrinterIcon, Trash2Icon } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { toResumeValues } from "@/lib/mappings"
import { ResumeServerData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoadingButton } from "@/components/loading-button"

import { ResumePreview } from "../../_components/resume-preview"
import { deleteResume } from "../actions"

interface ResumeItemProps {
  resume: ResumeServerData
}

export function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrint = useReactToPrint({
    contentRef,
    documentTitle: resume.title ?? "Resume",
  })
  const wasUpdated = resume.updatedAt !== resume.createdAt

  return (
    <div className="group relative border hover:ring-1 hover:ring-ring rounded-lg transition-colors p-3">
      <div className="absolute top-1 right-1 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <MoreMenu resumeId={resume.id} onPrintClick={reactToPrint} />
      </div>
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
            contentRef={contentRef}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
    </div>
  )
}

interface MoreMenuProps {
  resumeId: string
  onPrintClick: () => void
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId)
      } catch (e) {
        console.error(e)
        toast({
          variant: "destructive",
          description: "Something went wrong... Please try again.",
        })
      }
    })
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onPrintClick}>
            <PrinterIcon className="size-4" />
            Print
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <Trash2Icon className="size-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete this resume from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              variant="destructive"
              loading={isPending}
              onClick={handleDelete}
            >
              Delete
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
