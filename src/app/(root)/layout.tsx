import { Navbar } from "./_components/navbar"
import { PremiumDialog } from "./_components/premium-dialog"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {children}
      <PremiumDialog />
    </div>
  )
}
