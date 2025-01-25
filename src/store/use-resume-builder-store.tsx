import { create } from "zustand"

import { ResumeValues } from "@/lib/validation"

const initialResumeState = {
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
}

interface ResumeBuilderState {
  resumeData: ResumeValues
  setResumeData: (data: ResumeValues) => void
  initResumeData: (data: ResumeValues | null) => void
  currentStep: string
  setCurrentStep: (step: string) => void
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  resumeData: {},
  currentStep: "",

  setResumeData: (data: ResumeValues) => {
    set((state) => ({
      resumeData: { ...state.resumeData, ...data },
    }))
  },

  initResumeData: (data: ResumeValues | null) => {
    set({ resumeData: data ? data : initialResumeState })
  },

  setCurrentStep: (step: string) => set({ currentStep: step }),
}))
