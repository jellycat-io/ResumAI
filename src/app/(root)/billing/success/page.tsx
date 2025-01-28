import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function BillingSuccessPage() {
  return (
    <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center space-y-6 px-6 text-center">
      <h1 className="text-3xl font-bold">Billing Success</h1>
      <p>
        The checkout was successfull and your Premium account has been
        activated. Enjoy!
      </p>
      <Button asChild>
        <Link href="/resumes">Go To Resumes</Link>
      </Button>
    </main>
  )
}
