'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'

const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const GENERIC_MESSAGE =
  'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data.email)
    } catch {
      // Ignoramos el error a propósito: nunca revelamos si el correo existe
      // o no (sección 5 del brief) — siempre mostramos el mismo mensaje
      // genérico, incluso si el backend no respondió.
    } finally {
      setIsLoading(false)
      setSent(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-corporate-blue">
              Capital Consulting
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Recupera el acceso a tu panel de control
            </p>
          </div>

          {sent ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheck className="h-6 w-6" />
              </div>
              <p className="text-sm text-foreground">{GENERIC_MESSAGE}</p>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Volver a iniciar sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Escribe tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@capital.com"
                    className="pl-9"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <Button type="submit" variant="corporate" size="full" loading={isLoading}>
                Enviar instrucciones
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="inline-flex items-center gap-2 text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Volver a iniciar sesión
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
