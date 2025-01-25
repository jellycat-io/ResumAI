import { ResumeServerData } from "./types"
import { ResumeValues } from "./validation"

export function toResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title ?? undefined,
    description: data.description ?? undefined,
    photo: data.photoUrl ?? undefined,
    firstName: data.firstName ?? undefined,
    lastName: data.lastName ?? undefined,
    jobTitle: data.jobTitle ?? undefined,
    city: data.city ?? undefined,
    country: data.country ?? undefined,
    phone: data.phone ?? undefined,
    email: data.email ?? undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position ?? undefined,
      company: exp.company ?? undefined,
      startDate: exp.startDate ?? undefined,
      endDate: exp.endDate ?? undefined,
      description: exp.description ?? undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree ?? undefined,
      school: edu.school ?? undefined,
      startDate: edu.startDate ?? undefined,
      endDate: edu.endDate ?? undefined,
      description: edu.description ?? undefined,
    })),
    skills: data.skills ?? undefined,
    summary: data.summary ?? undefined,
    colorHex: data.colorHex ?? undefined,
    borderStyle: data.borderStyle ?? undefined,
  }
}
