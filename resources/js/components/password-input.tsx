import * as React from "react";
import { useState } from "react";
import { Lock, Eye, EyeOff, LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  error?: string; // Server-side or external error
  label?: string;
  showToggle?: boolean;
  icon?: LucideIcon;
  containerClassName?: string;
}

export function PasswordInput({
  value,
  error,
  label,
  id,
  className,
  containerClassName,
  icon: Icon = Lock,
  showToggle = true,
  placeholder = "••••••••",
  autoComplete = "new-password",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <Label 
          htmlFor={id} 
          className="text-foreground font-semibold text-sm mb-2.5 block"
        >
          {label}
        </Label>
      )}
      
      <div className="relative group">
        {/* Icon (Right) */}
        <Icon className="absolute right-3.5 top-3.5 w-5 h-5 text-muted-foreground z-10 group-hover:text-primary transition-colors duration-200" />
        
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          dir="ltr"
          placeholder={placeholder}
          autoComplete={autoComplete}
          // pr-11 for Icon, pl-11 for Toggle Button
          className={cn(
            "pr-11 pl-11 text-left", 
            error && "border-destructive focus-visible:ring-destructive/20", // Highlight border on error
            className
          )}
          {...props}
        />

        {/* Visibility Toggle (Left) */}
        {showToggle && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute left-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            tabIndex={-1}
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-destructive text-xs mt-1 animate-fade-in font-medium">
          {error}
        </p>
      )}
    </div>
  );
}