"use server"

import path from "path"

import { db } from "@/server/db"
import { openai } from "@ai-sdk/openai"
import { auth } from "@clerk/nextjs/server"
import { del, put } from "@vercel/blob"
import { generateText } from "ai"

import { resumeDataInclude } from "@/lib/types"
import {
  GenerateSummaryInput,
  generateSummarySchema,
  resumeSchema,
  ResumeValues,
} from "@/lib/validation"

export async function getResume(resumeId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const existingResume = resumeId
    ? await db.resume.findUnique({
        where: { id: resumeId, userId },
        include: resumeDataInclude,
      })
    : null

  return existingResume
}

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

  console.log("ID:", id)

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

export async function generateSummary(input: GenerateSummaryInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // TODO: Check for user's premium status

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input)

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professionnal introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `

  const prompt = `
    Please generate a professional resume summary from this data:
    USER DATA:
    Job title: ${jobTitle ?? "N/A"}
    
    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position ?? "N/A"}
        Company: ${exp.company ?? "N/A"}
        From ${exp.startDate ?? "N/A"} to ${exp.endDate ?? "present"}
        Description:
        ${exp.description ?? "N/A"}
      `,
      )
      .join("\n\n")}
    
    Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree ?? "N/A"}
        School: ${edu.school ?? "N/A"}
        From ${edu.startDate ?? "N/A"} to ${edu.endDate ?? "present"}
        Description:
        ${edu.description ?? "N/A"}
      `,
      )
      .join("\n\n")}

    Skills:
    ${skills}
    END OF USER DATA
  `

  console.log(systemMessage, prompt)

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    prompt,
  })

  if (!text) throw new Error("Failed to generate AI response")

  return text
}
