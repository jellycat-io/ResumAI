import { z } from "zod"

export const optionalString = z.string().trim().optional().or(z.literal(""))

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
})

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) => !file || (file instanceof File && isImageMimeType(file.type)),
      "Must be a .jpg or .png file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
})

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        description: optionalString,
      }),
    )
    .optional(),
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>
export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number]

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        description: optionalString,
      }),
    )
    .optional(),
})

export type EducationValues = z.infer<typeof educationSchema>

export const skillSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
})

export type SkillValues = z.infer<typeof skillSchema>

export const summarySchema = z.object({
  summary: optionalString,
})

export type SummaryValues = z.infer<typeof summarySchema>

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string
  photo?: File | string | null
}

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
  skills: z.string().trim().optional(),
})

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillSchema.shape,
})

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>

function isImageMimeType(type: Blob["type"]) {
  return type === "image/jpeg" || type === "image/png"
}
