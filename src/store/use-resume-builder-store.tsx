import { create } from "zustand"

import { ResumeValues } from "@/lib/validation"

interface ResumeBuilderState {
  resumeData: ResumeValues
  setResumeData: (data: ResumeValues) => void

  currentStep: string
  setCurrentStep: (step: string) => void
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  resumeData: {
    title: "",
    description: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    photo: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    workExperiences: [],
    educations: [],
    skills: [],
    summary: "",
    colorHex: "#000000",
    borderStyle: "squircle",
  },
  currentStep: "",

  setResumeData: (data: ResumeValues) => {
    set((state) => ({
      resumeData: { ...state.resumeData, ...data },
    }))
  },

  setCurrentStep: (step: string) => set({ currentStep: step }),
}))
