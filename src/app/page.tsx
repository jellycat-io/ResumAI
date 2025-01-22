import { ThemeSwitcher } from "@/components/theme-switcher"

import { Clock } from "./_components/clock"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <h1 className="text-3xl font-bold">Hello, World! 👋</h1>
      <Clock />
    </main>
  )
}
