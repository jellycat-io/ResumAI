"use client"

import { useRouter } from "next/navigation"

import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignOutButton,
  useClerk,
} from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { CreditCardIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

export function UserButton() {
  return (
    <>
      <ClerkLoading>
        <Skeleton className="size-9" />
      </ClerkLoading>
      <ClerkLoaded>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <UserIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <SignedInState />
          <SignedOutState />
        </DropdownMenu>
      </ClerkLoaded>
    </>
  )
}

function SignedInState() {
  const { session, openUserProfile } = useClerk()
  const { resolvedTheme } = useTheme()
  const router = useRouter()

  const isDark = resolvedTheme === "dark"

  return (
    <SignedIn>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Manage Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              openUserProfile({
                appearance: { baseTheme: isDark ? dark : undefined },
              })
            }
          >
            <UserIcon className="size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCardIcon className="size-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <SignOutButton signOutOptions={{ sessionId: session?.id }}>
            <DropdownMenuItem>
              <LogOutIcon className="size-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </SignOutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </SignedIn>
  )
}

function SignedOutState() {
  const router = useRouter()

  return (
    <SignedOut>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push("/sign-in")}>
          <span>Sign In</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </SignedOut>
  )
}
