import React, { forwardRef } from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "../../libs/utils"

const Progress = forwardRef(({ className, value, ...rest }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...rest}
    >
      <ProgressPrimitive.Indicator
        className="h-full bg-primary transition-all"
        style={{ width: `${value || 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = "Progress"

export { Progress }
