"use client"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { WandSparklesIcon } from "lucide-react"
import { useForm } from "react-hook-form"

import { ResumeValues, summarySchema, SummaryValues } from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/loading-button"

import { useResumeData } from "../_context/_resume-data-context"
import { generateSummary } from "../actions"

export function SummaryForm() {
  const { resumeData, setResumeData } = useResumeData()
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary ?? "",
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return

      setResumeData({
        ...resumeData,
        ...values,
      })
    })

    return unsubscribe
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Summary</h2>
        <p className="text-sm text-muted-foreground">
          Write a short introduction about yourself, or let the AI generate one
          from your entered data.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={`To uncover the truth behind paranormal phenomena, expose government conspiracies, and continue the pursuit of extraterrestrial intelligence while maintaining my belief that "The Truth is Out There."`}
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
                <GenerateSummaryButton
                  resumeData={resumeData}
                  onSummaryGenerated={(summary) =>
                    form.setValue("summary", summary)
                  }
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues
  onSummaryGenerated: (summary: string) => void
}

function GenerateSummaryButton({
  resumeData,
  onSummaryGenerated,
}: GenerateSummaryButtonProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    // TODO: Check user's premium status

    try {
      setLoading(true)
      const aiResponse = await generateSummary(resumeData)
      onSummaryGenerated(aiResponse)
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        description: "Something went wrong... Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      type="button"
      variant="outline"
      icon={WandSparklesIcon}
      loading={loading}
      onClick={handleClick}
    >
      {loading ? "Generating..." : "Generate with AI"}
    </LoadingButton>
  )
}
