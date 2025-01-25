import { Prisma } from "@prisma/client"

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude
}>
