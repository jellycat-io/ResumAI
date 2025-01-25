import { useEffect, useState } from "react"

import { ResumeValues } from "@/lib/validation"
import { useDebounce } from "@/hooks/use-debounce"

export function useAutoSaveResume(resumeData: ResumeValues) {
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  )
  const [isSaving, setIsSaving] = useState(false)
  const debouncedResumeData = useDebounce<ResumeValues>(resumeData, 1500)

  useEffect(() => {
    async function save() {
      setIsSaving(true)
      // TODO: Save to db
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setLastSavedData(structuredClone(debouncedResumeData))
      setIsSaving(false)
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData)

    if (hasUnsavedChanges && debouncedResumeData && !isSaving) {
      save()
    }
  }, [debouncedResumeData, lastSavedData, isSaving])

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  }
}
