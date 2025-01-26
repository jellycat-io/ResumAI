"use client"

import { Loader2Icon, LucideIcon } from "lucide-react"

import { Button, ButtonProps } from "@/components/ui/button"

interface LoadingButtonProps extends ButtonProps {
  icon?: LucideIcon
  loading: boolean
}

export function LoadingButton({
  loading,
  disabled,
  icon: Icon,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? (
        <Loader2Icon className="size-4 animate-spin" />
      ) : Icon ? (
        Icon && <Icon className="size-4" />
      ) : null}
      {children}
    </Button>
  )
}
