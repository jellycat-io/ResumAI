"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { generalInfoSchema, GeneralInfoValues } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useResumeData } from "../_contexts/resume-data-context"

export function GeneralInfoForm() {
  const { resumeData, setResumeData } = useResumeData()
  const form = useForm<GeneralInfoValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title ?? "",
      description: resumeData.description ?? "",
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
    <div className="mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Fox Mulder's resume" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="I want to believe"
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Describe what this resume is for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
