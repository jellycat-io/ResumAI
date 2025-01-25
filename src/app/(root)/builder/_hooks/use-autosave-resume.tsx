import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { fileReplacer } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

import { saveResume } from "../actions"

export function useAutoSaveResume(resumeData: ResumeValues) {
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  )
  const debouncedResumeData = useDebounce<ResumeValues>(resumeData, 1500)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [resumeId, setResumeId] = useState(resumeData.id)
  const [isSaving, setIsSaving] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsError(false)
  }, [debouncedResumeData])

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true)
        setIsError(false)

        const newData = structuredClone(debouncedResumeData)
        const updatedResume = await saveResume({
          ...newData,
          // If photo is unchanged, don't send it to the server
          ...(JSON.stringify(lastSavedData.photo, fileReplacer) ===
            JSON.stringify(newData.photo, fileReplacer) && {
            photo: undefined,
          }),
          id: resumeId,
        })

        setResumeId(updatedResume.id)
        setLastSavedData(newData)

        if (searchParams.get("resumeId") !== resumeId) {
          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set("resumeId", updatedResume.id)
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          )
        }
      } catch (e) {
        setIsError(true)
        console.error(e)
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes.</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dismiss()
                  save()
                }}
              >
                Retry
              </Button>
            </div>
          ),
        })
      } finally {
        setIsSaving(false)
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer)

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save()
    }
  }, [
    debouncedResumeData,
    lastSavedData,
    isSaving,
    isError,
    resumeId,
    searchParams,
    toast,
  ])

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  }
}
