"use client"

import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/molecules/FileUpload/FileUpload"
import { RESUME_RULE } from "@/lib/api/file-validation"

interface ResumeStepProps {
  resume: File | null
  onChange: (file: File | null) => void
  error?: string
}

/** Hoja de vida — sección 4, bloque "Hoja de vida". No es un campo de react-hook-form: es un archivo. */
export function ResumeStep({ resume, onChange, error }: ResumeStepProps) {
  return (
    <div>
      <Label htmlFor="hojaDeVida">
        Adjunta tu hoja de vida <span className="text-destructive">*</span>
      </Label>
      <p className="mt-1 text-sm text-muted-foreground">
        Formatos permitidos: PDF, DOC y DOCX. Tamaño máximo: 5 MB.
      </p>
      <div className="mt-4">
        <FileUpload
          id="hojaDeVida"
          rule={RESUME_RULE}
          accept={{
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
          }}
          value={resume}
          onChange={onChange}
          hint="PDF, DOC o DOCX · máx. 5MB"
          error={error}
        />
      </div>
    </div>
  )
}
