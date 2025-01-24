"use client"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { GripHorizontalIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"

import { BuilderFormProps } from "@/lib/types"
import { educationSchema, EducationValues } from "@/lib/validation"
import { Button } from "@/components/ui/button"
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
import { DatePicker } from "@/components/date-picker"

export function EducationForm({ resumeData, setResumeData }: BuilderFormProps) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations ?? [],
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return

      setResumeData({
        ...resumeData,
        educations: values.educations?.filter((ed) => ed !== undefined) ?? [],
      })
    })

    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  })

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">Where did you study?</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields.map((field, index) => (
            <EducationItem
              key={field.id}
              form={form}
              index={index}
              onRemove={remove}
            />
          ))}
          <div className="flex justify-center">
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                append({
                  description: "",
                })
              }
            >
              <PlusIcon className="size-4" />
              Add Education
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface EducationItemProps {
  form: UseFormReturn<EducationValues>
  index: number
  onRemove: (index: number) => void
}

function EducationItem({ form, index, onRemove }: EducationItemProps) {
  return (
    <div className="space-y-3 border rounded-md bg-background p-3">
      <div className="flex justify-between items-center gap-2">
        <span className="font-semibold">Education {index + 1}</span>
        <GripHorizontalIcon className="size-4 cursor-grab text-muted-foreground" />
      </div>
      <FormField
        control={form.control}
        name={`educations.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Bachelor of Arts in Psychology" />
            </FormControl>
            <FormMessage />
            <FormDescription>The degree you were studying for.</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`educations.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Oxford University" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`educations.${index}.startDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`educations.${index}.endDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormDescription>
        Leave <span className="font-semibold">end date</span> empty if you are
        currently studying.
      </FormDescription>
      <FormField
        control={form.control}
        name={`educations.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder={`Graduated summa cum laude, 1982Thesis: "The Psychological Effects of Belief in the Paranormal."`}
                rows={3}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="destructive-outline"
        size="icon"
        onClick={() => onRemove(index)}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  )
}
