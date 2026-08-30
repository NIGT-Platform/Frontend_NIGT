import * as React from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormField({ 
  label, 
  error, 
  required, 
  children, 
  className,
  ...props 
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
        {label}
        {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-[var(--color-danger)] font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
