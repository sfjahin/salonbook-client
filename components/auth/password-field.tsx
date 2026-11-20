"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function PasswordField({
  id,
  label = "Password",
  autoComplete,
  placeholder,
  helper,
  value,
  onChange,
}: {
  id: string
  label?: string
  autoComplete: string
  placeholder: string
  helper?: string
  value: string
  onChange: (value: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      <div className="relative mt-2">
        <Input
          id={id}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          className="h-11 rounded-md bg-background pr-14 text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-3 text-xs text-hero-muted transition-colors hover:text-foreground"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {helper ? <p className="mt-2 text-xs text-hero-muted">{helper}</p> : null}
    </div>
  )
}

export { PasswordField }
