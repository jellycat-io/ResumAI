"use server"

import path from "path"

import { db } from "@/server/db"
import { openai } from "@ai-sdk/openai"
import { auth } from "@clerk/nextjs/server"
import { del, put } from "@vercel/blob"
import { generateText } from "ai"

import {
  canCreateResume,
  canUseAITools,
  canUseCustomization,
} from "@/lib/permissions"
import { getUserSubscriptionLevel } from "@/lib/subscription"
import { resumeDataInclude } from "@/lib/types"
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  resumeSchema,
  ResumeValues,
  WorkExperience,
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
  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values)

  const subscriptionLevel = await getUserSubscriptionLevel(userId)

  if (!id) {
    const resumeCount = await db.resume.count({
      where: { userId },
    })

    if (!canCreateResume(subscriptionLevel, resumeCount)) {
      throw new Error(
        "Maximum resume count reached for this subscription level.",
      )
    }
  }

  const existingResume = id
    ? await db.resume.findUnique({
        where: { id, userId },
      })
    : null
  if (id && !existingResume) throw new Error("Resume not found")

  const hasCustomizations =
    (resumeValues.borderStyle &&
      resumeValues.borderStyle !== existingResume?.borderStyle) ||
    (resumeValues.colorHex &&
      resumeValues.colorHex !== existingResume?.colorHex)

  if (hasCustomizations && !canUseCustomization(subscriptionLevel)) {
    throw new Error("Customizations not allowed for this subscription level.")
  }

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

  const subscriptionLevel = await getUserSubscriptionLevel(userId)

  if (!canUseAITools(subscriptionLevel))
    throw new Error("AI tools unavailable with this subscription level.")

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input)

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professionnal introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise, professional, first-person, and as if the user wrote it themselves.
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

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const subscriptionLevel = await getUserSubscriptionLevel(userId)

  if (!canUseAITools(subscriptionLevel))
    throw new Error("AI tools unavailable with this subscription level.")

  const { description, skills } = generateWorkExperienceSchema.parse(input)

  const systemMessage = `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

    Job title: <job title>
    Company: <company name>
    Start date: <format: YYYY-MM-DD> (only if provided)
    End date: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be infered from the job title and the skills>
    Skills: <format: skills are separated by commas and must be correctly formatted (i.e. ReactJS, NextJS)>
  `

  const prompt = `
    Please provide a work experience entry from this data:
    START USER DATA
    Description: ${description}
    Skills: ${skills}
    END OF USER DATA
  `

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: systemMessage,
    prompt,
  })

  if (!text) throw new Error("Failed to generate AI response")

  return {
    position: (text.match(/Job title: (.*)/)?.[1] ?? "").trim(),
    company: (text.match(/Company: (.*)/)?.[1] ?? "").trim(),
    description: (text.match(/Description: ([\s\S]*)/)?.[1] ?? "").trim(),
    startDate: new Date(
      text.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1] ?? "",
    ),
    endDate: new Date(text.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1] ?? ""),
  } satisfies WorkExperience
}
