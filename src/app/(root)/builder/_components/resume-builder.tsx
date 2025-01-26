"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { ResumeServerData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useUnloadWarning } from "@/hooks/use-unload-warning"
import { Separator } from "@/components/ui/separator"

import {
  ResumeDataProvider,
  useResumeData,
} from "../_context/_resume-data-context"
import { useAutoSaveResume } from "../_hooks/use-autosave-resume"
import { BUILDER_STEPS } from "../steps"
import { Breadcrumbs } from "./breadcrumbs"
import { Footer } from "./footer"
import { RenderPreview } from "./render-preview"

interface ResumeBuilderProps {
  resume: ResumeServerData | null
}

export function ResumeBuilder({ resume }: ResumeBuilderProps) {
  return (
    <ResumeDataProvider initialResume={resume}>
      <ResumeBuilderContent />
    </ResumeDataProvider>
  )
}

function ResumeBuilderContent() {
  const [showSmResumePreview, setShowSmResumePreview] = useState(false)
  const { resumeData } = useResumeData()
  const searchParams = useSearchParams()

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData)

  useUnloadWarning(hasUnsavedChanges)

  const currentStep = searchParams.get("step") || BUILDER_STEPS[0].key

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
  }

  const FormComponent = BUILDER_STEPS.find(
    (step) => step.key === currentStep,
  )?.component

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 px-3 py-5 text-center border-b">
        <h1 className="text-2xl font-bold">Design Your Resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute inset-0 flex w-full">
          <section
            className={cn(
              "w-full md:w-1/2 md:flex md:flex-col p-6 overflow-y-auto space-y-6",
              showSmResumePreview && "hidden",
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent />}
          </section>
          <Separator orientation="vertical" className="grow" />
          <RenderPreview className={cn(showSmResumePreview && "flex")} />
        </div>
      </main>
      <Footer
        isSaving={isSaving}
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowSmResumePreview={setShowSmResumePreview}
      />
    </div>
  )
}
