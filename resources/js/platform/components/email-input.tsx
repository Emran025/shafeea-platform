import * as React from "react";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  error?: string;
  label?: string;
  containerClassName?: string;
}

/**
 * EmailInput Component
 * 
 * A specialized input for email addresses.
 * - Forces LTR text direction for correct email formatting.
 * - Includes a static Mail icon.
 * - Handles error states matching the application theme.
 */
export function EmailInput({
  value,
  error,
  label = "البريد الإلكتروني",
  className,
  containerClassName,
  ...props
}: EmailInputProps) {
  return (
    <div className={cn("w-full", containerClassName)}>
      <Label 
        htmlFor="email" 
        className="text-foreground font-semibold text-sm mb-2.5 block"
      >
        {label}
      </Label>
      
      <div className="relative group">
        <Mail className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
        
        <Input
          id="email"
          type="email"
          value={value}
          dir="ltr"
          className={cn("pr-11 text-left", className)}
          autoComplete="username"
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-destructive text-xs mt-1 animate-fade-in font-medium">
          {error}
        </p>
      )}
    </div>
  );
}