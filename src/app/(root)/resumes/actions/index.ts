"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/server/db"
import { auth } from "@clerk/nextjs/server"
import { del } from "@vercel/blob"

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

export async function deleteResume(resumeId: string) {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const existingResume = await db.resume.findUnique({
    where: { id: resumeId, userId },
  })

  if (!existingResume) throw new Error(`Resume not found <${resumeId}>`)

  if (existingResume.photoUrl) {
    await del(existingResume.photoUrl)
  }

  await db.resume.delete({
    where: { id: resumeId },
  })

  revalidatePath("/resumes")
}
