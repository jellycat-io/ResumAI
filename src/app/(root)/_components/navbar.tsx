"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useTheme } from "next-themes"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserButton } from "@/components/user-button"

export function Navbar() {
  const [logoColor, setLogoColor] = useState("light")
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setLogoColor(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme])

  return (
    <nav className="w-full px-4 py-2 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="relative group cursor-pointer px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-purple-500/60 dark:from-blue-500/30 dark:to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 duration-300 transition-all pointer-events-none" />
          <Link href="/resumes">
            <Image
              src={`/logo-${logoColor}.png`}
              alt="logo"
              width={500}
              height={200}
              quality={100}
              className="w-32"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
