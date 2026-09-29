import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "default" && "bg-primary text-white hover:opacity-90",
          variant === "outline" && "border border-border bg-transparent hover:bg-slate-100",
          variant === "ghost" && "hover:bg-slate-100",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
