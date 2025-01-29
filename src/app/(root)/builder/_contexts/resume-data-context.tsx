import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react"

import { toResumeValues } from "@/lib/mappings"
import { ResumeServerData } from "@/lib/types"
import { ResumeValues } from "@/lib/validation"

interface ResumeDataContextType {
  resumeData: ResumeValues
  setResumeData: Dispatch<SetStateAction<ResumeValues>>
}

const defaultResumeDataContext: ResumeDataContextType = {
  resumeData: {} as ResumeValues,
  setResumeData: () => {},
}

const ResumeDataContext = createContext<ResumeDataContextType>(
  defaultResumeDataContext,
)

export function ResumeDataProvider({
  children,
  initialResume,
}: {
  children: React.ReactNode
  initialResume: ResumeServerData | null
}) {
  const [resumeData, setResumeData] = useState(
    initialResume ? toResumeValues(initialResume) : {},
  )

  return (
    <ResumeDataContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeDataContext.Provider>
  )
}

export function useResumeData() {
  return useContext(ResumeDataContext)
}
