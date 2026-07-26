import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // 1. Layout & Typography
        "flex min-h-[80px] w-full rounded-xl px-3 py-2 text-base md:text-sm transition-all duration-200",
        "placeholder:text-muted-foreground",
        
        // 2. Borders & Backgrounds (Same as Input)
        "border-[1.5px] border-input bg-white",
        "dark:bg-muted/20", 

        // 3. Ring Styling (Same as Input)
        "ring-1 ring-ring/10 dark:ring-white/5",

        // 4. Focus State (Same as Input)
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10",
        "focus-visible:ring-offset-0",

        // 5. Hover State (Same as Input)
        "hover:border-primary/50 hover:bg-white/80 dark:hover:bg-muted/30",

        // 6. Utility & Validation
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }