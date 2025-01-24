import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import { useResumeBuilderStore } from "@/store/use-resume-builder-store"
import { formatDate } from "date-fns"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"
import { Badge } from "@/components/ui/badge"

import { BORDER_STYLES } from "./border-picker"

interface RenderPreviewContentProps {
  className?: string
}

export function RenderPreviewContent({ className }: RenderPreviewContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { width } = useDimensions(containerRef)

  return (
    <div
      className={cn(
        "w-full h-fit aspect-[210/297] bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfoHeader />
        <SummarySection />
        <WorkExperienceSection />
        <EducationSection />
        <SkillsSection />
      </div>
    </div>
  )
}

function PersonalInfoHeader() {
  const { resumeData } = useResumeBuilderStore()
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo)

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : ""
    if (objectUrl) setPhotoSrc(objectUrl)
    if (photo === null) setPhotoSrc("")

    return () => URL.revokeObjectURL(objectUrl)
  }, [photo])

  return (
    <header className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          width={100}
          height={100}
          alt="Author photo"
          className="aspect-square object-cover"
          style={{
            borderRadius:
              borderStyle === BORDER_STYLES.SQUARE
                ? "0px"
                : borderStyle === BORDER_STYLES.CIRCLE
                  ? "999px"
                  : "16px",
          }}
        />
      )}
      <div className="space-y-3">
        <div style={{ color: colorHex }}>
          <p className="text-2xl font-bold">{`${firstName} ${lastName}`}</p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country ? ", " : ""}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </header>
  )
}

function SummarySection() {
  const { resumeData } = useResumeBuilderStore()
  const { summary } = resumeData

  if (!summary) return null

  return (
    <section>
      <SectionSeparator />
      <div className="space-y-3 break-inside-avoid">
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </section>
  )
}

function WorkExperienceSection() {
  const { resumeData } = useResumeBuilderStore()
  const { workExperiences, colorHex } = resumeData

  const filledWorkExperiences = getFilledArray(workExperiences)

  if (!filledWorkExperiences?.length) return null

  return (
    <section>
      <SectionSeparator />
      <div className="space-y-3">
        <SectionTitle>Work Experience</SectionTitle>
        {filledWorkExperiences.map((exp, index) => (
          <div
            key={`work-exp-${index}`}
            className="break-inside-avoid space-y-1"
          >
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")}
                  {" - "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationSection() {
  const { resumeData } = useResumeBuilderStore()
  const { educations, colorHex } = resumeData

  const filledEducations = getFilledArray(educations)

  if (!filledEducations?.length) return null

  return (
    <section>
      <SectionSeparator />
      <div className="space-y-3">
        <SectionTitle>Education</SectionTitle>
        {filledEducations.map((edu, index) => (
          <div
            key={`work-exp-${index}`}
            className="break-inside-avoid space-y-1"
          >
            <div
              className="flex items-center justify-between text-sm font-semibold"
              style={{ color: colorHex }}
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {formatDate(edu.startDate, "MM/yyyy")}
                  {edu.endDate
                    ? ` - ${formatDate(edu.endDate, "MM/yyyy")}`
                    : ""}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
            <div className="whitespace-pre-line text-xs">{edu.description}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection() {
  const { resumeData } = useResumeBuilderStore()
  const { skills, colorHex, borderStyle } = resumeData

  if (!skills?.length) return

  return (
    <section>
      <SectionSeparator />
      <div className="space-y-3">
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap items-center break-inside-avoid gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={`skill-${index}`}
              className="text-white rounded-md cursor-default"
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BORDER_STYLES.SQUARE
                    ? "0px"
                    : borderStyle === BORDER_STYLES.CIRCLE
                      ? "999px"
                      : "8px",
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  )
}

function SectionSeparator() {
  const {
    resumeData: { colorHex },
  } = useResumeBuilderStore()

  return <hr className="border-b-2 mb-3" style={{ borderColor: colorHex }} />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  const {
    resumeData: { colorHex },
  } = useResumeBuilderStore()
  return (
    <p className="text-lg font-semibold" style={{ color: colorHex }}>
      {children}
    </p>
  )
}

function getFilledArray(array?: Array<any>) {
  return (
    array?.filter((item) => Object.values(item).filter(Boolean).length > 0) ??
    []
  )
}
