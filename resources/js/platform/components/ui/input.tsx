import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 1. Layout & Typography
        "flex h-12 w-full min-w-0 rounded-xl px-3 py-1 text-base md:text-sm transition-all duration-200",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground",

        // 2. Borders & Backgrounds
        "border-2 border-input bg-white shadow-sm", 
        "dark:bg-muted/20", 

        // 3. Ring Styling
        "ring-1 ring-ring/10 dark:ring-white/5", 

        // 4. Focus State - Enhanced
        "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:shadow-md",

        // 5. AUTOFILL FIX (The "Invisible" Solution)
        "[&:-webkit-autofill]:transition-[background-color] [&:-webkit-autofill]:duration-[99999s]",
        "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]",
        "[&:-webkit-autofill]:[caret-color:var(--foreground)]",

        // 6. Utility
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "disabled:cursor-not-allowed disabled:opacity-50",

        // 7. Hover
        "hover:border-primary/50 hover:bg-white/80 dark:hover:bg-muted/30",

        className
      )}
      {...props}
    />
  )
}

export { Input }