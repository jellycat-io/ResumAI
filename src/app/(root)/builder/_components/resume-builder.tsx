"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { ResumeValues } from "@/lib/validation"
import { Separator } from "@/components/ui/separator"

import { BUILDER_STEPS } from "../steps"
import { Breadcrumbs } from "./breadcrumbs"
import { Footer } from "./footer"

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeValues>({})
  const searchParams = useSearchParams()

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
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design Your Resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute inset-0 flex w-full">
          <section className="w-full md:w-1/2 p-3 overflow-y-auto space-y-6">
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </section>
          <Separator orientation="vertical" className="grow" />
          <section className="hidden w-1/2 md:flex p-3">
            <pre className="p-3 w-full rounded-md bg-accent text-accent-foreground font-mono text-sm">
              {JSON.stringify(resumeData, null, 2)}
            </pre>
          </section>
        </div>
      </main>
      <Footer currentStep={currentStep} setCurrentStep={setStep} />
    </div>
  )
}
