"use client"

import { useEffect, useState } from "react"

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  GripHorizontalIcon,
  PlusIcon,
  Trash2Icon,
  WandSparklesIcon,
} from "lucide-react"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
  workExperienceSchema,
  WorkExperienceValues,
} from "@/lib/validation"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { LoadingButton } from "@/components/loading-button"

import { useResumeData } from "../_context/_resume-data-context"
import { generateWorkExperience } from "../actions"

export function WorkExperienceForm() {
  const { resumeData, setResumeData } = useResumeData()
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData.workExperiences,
    },
  })

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger()
      if (!isValid) return

      setResumeData({
        ...resumeData,
        workExperiences:
          values.workExperiences?.filter((exp) => exp !== undefined) ?? [],
      })
    })

    return unsubscribe
  }, [form, resumeData, setResumeData])

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)

      move(oldIndex, newIndex)
      return arrayMove(fields, oldIndex, newIndex)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work experience</h2>
        <p className="text-sm text-muted-foreground">Where did you work?</p>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <WorkExperienceItem
                  key={field.id}
                  form={form}
                  id={field.id}
                  index={index}
                  onRemove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                append({
                  position: "",
                  company: "",
                  description: "",
                })
              }
            >
              <PlusIcon className="size-4" />
              Add Work Experience
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

interface WorkExperienceItemProps {
  form: UseFormReturn<WorkExperienceValues>
  id: string
  index: number
  onRemove: (index: number) => void
}

function WorkExperienceItem({
  form,
  id,
  index,
  onRemove,
}: WorkExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  function handleGenerateWorkExperience(workExperience: WorkExperience) {
    form.setValue(`workExperiences.${index}`, {
      ...workExperience,
      startDate: workExperience.startDate
        ? new Date(workExperience.startDate)
        : undefined,
      endDate: workExperience.endDate
        ? new Date(workExperience.endDate)
        : undefined,
    })
  }

  return (
    <div
      className={cn(
        "space-y-3 border rounded-md bg-background p-3",
        isDragging && "shadow-xl z-50 cursor-grab relative",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Work experience {index + 1}</span>
          <GenerateWorkExperienceButton
            onWorkExperienceGenerated={handleGenerateWorkExperience}
          />
        </div>
        <GripHorizontalIcon
          className="size-4 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>

      <FormField
        control={form.control}
        name={`workExperiences.${index}.position`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Special Agent" />
            </FormControl>
            <FormMessage />
            <FormDescription>
              The title of the position you occupied.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`workExperiences.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input {...field} placeholder="FBI X-Files Division" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`workExperiences.${index}.startDate`}
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
          name={`workExperiences.${index}.endDate`}
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
        Leave <span className="font-semibold">end date</span> empty if this is
        your current job.
      </FormDescription>
      <FormField
        control={form.control}
        name={`workExperiences.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Exposed government cover-ups and conspiracies while pursuing evidence of alien life"
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

interface GenerateWorkExperienceButtonProps {
  onWorkExperienceGenerated: (workExperience: WorkExperience) => void
}

function GenerateWorkExperienceButton({
  onWorkExperienceGenerated,
}: GenerateWorkExperienceButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
      skills: "",
    },
  })

  async function onSubmit(values: GenerateWorkExperienceInput) {
    try {
      setLoading(true)
      const aiResponse = await generateWorkExperience(values)
      onWorkExperienceGenerated(aiResponse)
    } catch (e) {
      console.error(e)
      toast({
        variant: "destructive",
        description: "Something went wrong... Please try again.",
      })
    } finally {
      setLoading(false)
      setShowDialog(false)
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Generate with AI"
        >
          <WandSparklesIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experience</DialogTitle>
          <DialogDescription>
            Describe this work experience and the AI will generate an optimized
            entry for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Separate each skill with a comma.
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton icon={WandSparklesIcon} loading={loading}>
                {loading ? "Generating..." : "Generate"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
