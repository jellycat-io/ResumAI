"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import { formatDate } from "date-fns"

import { cn } from "@/lib/utils"
import { ResumeValues } from "@/lib/validation"
import { useDimensions } from "@/hooks/use-dimensions"
import { Badge } from "@/components/ui/badge"

import { BORDER_STYLES } from "../constants"

interface ResumePreviewProps {
  className?: string
  resumeData: ResumeValues
  contentRef?: React.Ref<HTMLDivElement>
}

export function ResumePreview({
  className,
  resumeData,
  contentRef,
}: ResumePreviewProps) {
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
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  )
}

interface ResumePreviewSectionProps {
  resumeData: ResumeValues
}

function PersonalInfoHeader({ resumeData }: ResumePreviewSectionProps) {
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
          <p className="text-2xl font-bold">{`${firstName ?? ""} ${lastName ?? ""}`}</p>
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

function SummarySection({ resumeData }: ResumePreviewSectionProps) {
  const { summary } = resumeData

  if (!summary) return null

  return (
    <section>
      <SectionSeparator colorHex={resumeData.colorHex} />
      <div className="space-y-3 break-inside-avoid">
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </section>
  )
}

function WorkExperienceSection({ resumeData }: ResumePreviewSectionProps) {
  const { workExperiences, colorHex } = resumeData

  const filledWorkExperiences = getFilledArray(workExperiences)

  if (!filledWorkExperiences?.length) return null

  return (
    <section>
      <SectionSeparator colorHex={colorHex} />
      <div className="space-y-3">
        <SectionTitle colorHex={colorHex}>Work Experience</SectionTitle>
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
            <p className="text-xs font-semibold" style={{ color: colorHex }}>
              {exp.company}
            </p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function EducationSection({ resumeData }: ResumePreviewSectionProps) {
  const { educations, colorHex } = resumeData

  const filledEducations = getFilledArray(educations)

  if (!filledEducations?.length) return null

  return (
    <section>
      <SectionSeparator colorHex={colorHex} />
      <div className="space-y-3">
        <SectionTitle colorHex={colorHex}>Education</SectionTitle>
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
            <p className="text-xs font-semibold" style={{ color: colorHex }}>
              {edu.school}
            </p>
            <div className="whitespace-pre-line text-xs">{edu.description}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillsSection({ resumeData }: ResumePreviewSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData

  if (!skills?.length) return

  return (
    <section>
      <SectionSeparator colorHex={colorHex} />
      <div className="space-y-3">
        <SectionTitle colorHex={colorHex}>Skills</SectionTitle>
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

function SectionSeparator({ colorHex }: { colorHex?: string }) {
  return <hr className="border-b-2 mb-3" style={{ borderColor: colorHex }} />
}

function SectionTitle({
  children,
  colorHex,
}: {
  children: React.ReactNode
  colorHex?: string
}) {
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
