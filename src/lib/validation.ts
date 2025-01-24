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
      z
        .object({
          position: optionalString,
          company: optionalString,
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          description: optionalString,
        })
        .optional(),
    )
    .optional(),
})

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>

export const educationSchema = z.object({
  educations: z
    .array(
      z
        .object({
          degree: optionalString,
          school: optionalString,
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          description: optionalString,
        })
        .optional(),
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
})

export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string
  photo?: File | string | null
}

function isImageMimeType(type: Blob["type"]) {
  return type === "image/png" || type === "image/png"
}
