import { ThemeSwitcher } from "@/components/theme-switcher"
import { UserButton } from "@/components/user-button"

import { Clock } from "./_components/clock"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <UserButton />
        </div>
      </div>
      <h1 className="text-3xl font-bold">Hello, World! 👋</h1>
      <Clock />
    </main>
  )
}
