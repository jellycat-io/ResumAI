import { BuilderFormProps } from "@/lib/types"

import { GeneralInfoForm } from "./_components/general-info-form"
import { PersonalInfoForm } from "./_components/personal-info-form"

export const BUILDER_STEPS: {
  title: string
  component: React.ComponentType<BuilderFormProps>
  key: string
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
]
