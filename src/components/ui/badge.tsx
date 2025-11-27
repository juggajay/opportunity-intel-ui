import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-white text-black",
        secondary: "border-transparent bg-card text-foreground",
        destructive: "border-transparent bg-red-600 text-white",
        outline: "border-border text-foreground",
        // Status variants
        new: "border-transparent bg-status-new text-white",
        exploring: "border-transparent bg-status-exploring text-black",
        validating: "border-transparent bg-status-validating text-white",
        pursuing: "border-transparent bg-status-pursuing text-white",
        passed: "border-transparent bg-status-passed text-white",
        // Thesis variants
        ai: "border-transparent bg-thesis-ai/20 text-thesis-ai",
        trust: "border-transparent bg-thesis-trust/20 text-thesis-trust",
        physical: "border-transparent bg-thesis-physical/20 text-thesis-physical",
        incumbent: "border-transparent bg-thesis-incumbent/20 text-thesis-incumbent",
        speed: "border-transparent bg-thesis-speed/20 text-thesis-speed",
        execution: "border-transparent bg-thesis-execution/20 text-thesis-execution",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
