"use server"

import { db } from "@/server/db"
import { auth } from "@clerk/nextjs/server"

import { resumeDataInclude, ResumeServerData } from "@/lib/types"

export async function getResumeSummaries(): Promise<{
  resumes: ResumeServerData[]
  totalCount: number
}> {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const [resumes, totalCount] = await Promise.all([
    db.resume.findMany({
      where: { userId },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    db.resume.count({
      where: { userId },
    }),
  ])

  return {
    resumes,
    totalCount,
  }
}
