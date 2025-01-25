import { BuilderFormProps } from "@/lib/types"

import { EducationForm } from "./_components/education-form"
import { GeneralInfoForm } from "./_components/general-info-form"
import { PersonalInfoForm } from "./_components/personal-info-form"
import { SkillForm } from "./_components/skill-form"
import { SummaryForm } from "./_components/summary-form"
import { WorkExperienceForm } from "./_components/work-experience-form"

export const BUILDER_STEPS: {
  title: string
  component: React.ComponentType<BuilderFormProps>
  key: string
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  {
    title: "Work Experience",
    component: WorkExperienceForm,
    key: "work-experience",
  },
  {
    title: "Education",
    component: EducationForm,
    key: "educations",
  },
  {
    title: "Skills",
    component: SkillForm,
    key: "skills",
  },
  {
    title: "Summary",
    component: SummaryForm,
    key: "summary",
  },
]
