"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { skillSchema, SkillValues } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { useResumeData } from "../_contexts/resume-data-context"

export function SkillForm() {
  const { resumeData, setResumeData } = useResumeData()
  const form = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: resumeData.skills ?? [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return

      setResumeData({
        ...resumeData,
        skills:
          values.skills
            ?.filter((skill) => skill !== undefined)
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "") ?? [],
      })
    })

    return unsubscribe
  }, [form, resumeData, setResumeData])

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">What are you good at?</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Skills</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g. Paranormal Knowledge, Criminal Profiling"
                    onChange={(e) => {
                      const skills = e.target.value.split(",")
                      field.onChange(skills)
                    }}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Separate each skill with a comma.
                </FormDescription>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
