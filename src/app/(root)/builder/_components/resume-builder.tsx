"use client"

import { useSearchParams } from "next/navigation"

import { useResumeBuilderStore } from "@/store/use-resume-builder-store"

import { Separator } from "@/components/ui/separator"

import { BUILDER_STEPS } from "../steps"
import { Breadcrumbs } from "./breadcrumbs"
import { Footer } from "./footer"
import { RenderPreview } from "./render-preview"

export function ResumeBuilder() {
  const { currentStep, setCurrentStep } = useResumeBuilderStore()
  const searchParams = useSearchParams()

  const urlStep = searchParams.get("step") || BUILDER_STEPS[0].key

  if (currentStep !== urlStep) {
    setCurrentStep(urlStep)
  }

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set("step", key)
    window.history.pushState(null, "", `?${newSearchParams.toString()}`)
    setCurrentStep(key)
  }

  const FormComponent = BUILDER_STEPS.find(
    (step) => step.key === urlStep,
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
          <section className="w-full md:w-1/2 p-6 overflow-y-auto space-y-6">
            <Breadcrumbs currentStep={urlStep} setCurrentStep={setStep} />
            {FormComponent && <FormComponent />}
          </section>
          <Separator orientation="vertical" className="grow" />
          <RenderPreview />
        </div>
      </main>
      <Footer currentStep={urlStep} setCurrentStep={setStep} />
    </div>
  )
}
