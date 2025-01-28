"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

export function HomeContent() {
  const [logoColor, setLogoColor] = useState("light")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setLogoColor(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center gap-6 px-5 text-center">
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      </div>
      <Image
        src={`/logo-${logoColor}.png`}
        alt="logo"
        width="500"
        height="200"
      />
      <h1 className="text-4xl font-extrabold tracking-light lg:text-5xl scroll-m-20">
        Create a{" "}
        <span className="bg-gradient-to-r text-transparent from-blue-500 to-purple-500 bg-clip-text">
          Perfect Resume
        </span>{" "}
        in Minutes
      </h1>
      <p className="text-lg">
        Our <span className="font-bold">AI resume builder</span> helps you
        design a professionnal resume even if like us, you think this is a
        chore.
      </p>
      <Button asChild size="lg" variant="premium">
        <Link href="/builder">Get started</Link>
      </Button>
    </main>
  )
}
