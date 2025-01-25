"use server"

import path from "path"

import { db } from "@/server/db"
import { auth } from "@clerk/nextjs/server"
import { del, put } from "@vercel/blob"

import { resumeSchema, ResumeValues } from "@/lib/validation"

export async function saveResume(values: ResumeValues) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const { id } = values
  console.log("Received values:", values)
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values)

  // TODO: Check resume count for non-premium users

  const existingResume = id
    ? await db.resume.findUnique({
        where: { id, userId },
      })
    : null
  if (id && !existingResume) throw new Error("Resume not found")

  let newPhotoUrl: string | undefined | null = undefined
  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }

    const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
      access: "public",
    })

    newPhotoUrl = blob.url
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl)
    }

    newPhotoUrl = null
  }

  if (id) {
    return db.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        photoUrl: newPhotoUrl,
        workExperiences: {
          deleteMany: {},
          create: workExperiences,
        },
        educations: {
          deleteMany: {},
          create: educations,
        },
        updatedAt: new Date(),
      },
    })
  } else {
    return db.resume.create({
      data: {
        ...resumeValues,
        userId,
        photoUrl: newPhotoUrl,
        workExperiences: {
          create: workExperiences,
        },
        educations: {
          create: educations,
        },
        updatedAt: new Date(),
      },
    })
  }
}
