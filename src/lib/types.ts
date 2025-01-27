import { Prisma } from "@prisma/client"

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
} satisfies Prisma.ResumeInclude

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude
}>

export type ResumeServerSummaryData = Prisma.ResumeGetPayload<{
  select: {
    id: true
    title: true
    description: true
    createdAt: true
    updatedAt: true
  }
}>
