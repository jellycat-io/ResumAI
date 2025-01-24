import Link from "next/link"

import { FileUserIcon, Loader2Icon, PenLineIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { BUILDER_STEPS } from "../steps"

interface FooterProps {
  currentStep: string
  setCurrentStep: (step: string) => void
  showSmResumePreview: boolean
  setShowSmResumePreview: (value: boolean) => void
}

export function Footer({
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowSmResumePreview,
}: FooterProps) {
  const previousStep = BUILDER_STEPS.find(
    (_, index) => BUILDER_STEPS[index + 1]?.key === currentStep,
  )?.key
  const nextStep = BUILDER_STEPS.find(
    (_, index) => BUILDER_STEPS[index - 1]?.key === currentStep,
  )?.key

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={!previousStep}
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
          >
            Previous
          </Button>
          <Button
            disabled={!nextStep}
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
          >
            Next
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          title={
            showSmResumePreview ? "Show resume form" : "Show resume preview"
          }
          className="md:hidden"
          onClick={() => setShowSmResumePreview(!showSmResumePreview)}
        >
          {showSmResumePreview ? (
            <PenLineIcon className="size-4" />
          ) : (
            <FileUserIcon className="size-4" />
          )}
        </Button>
        <div className="flex items-center justify-end gap-3">
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
  )
}
