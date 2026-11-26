'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/hooks/useAuth'
import {
  forgetRememberedEmail,
  getRememberedEmail,
  rememberEmail,
} from '@/lib/auth/remembered-email'
import { BACK_FALLBACK_PATH, resolveBackTarget } from '@/lib/navigation/safe-back'
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, isLoading, error } = useAuth()
  const {
    register,
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  // Se lee tras el montaje (no durante el render) para que el HTML del
  // servidor y la primera pintura del cliente coincidan: sin errores de
  // hidratación. La contraseña nunca se rellena.
  useEffect(() => {
    const rememberedEmail = getRememberedEmail()
    if (!rememberedEmail) return

    if (!getValues('email')) setValue('email', rememberedEmail)
    setValue('remember', true)
  }, [getValues, setValue])

  const onSubmit = async ({ email, password, remember }: LoginForm) => {
    const { success } = await login({ email, password })

    // Solo un acceso exitoso actualiza el correo recordado; si falla,
    // `useAuth` ya muestra el error y no se guarda nada.
    if (!success) return
    if (remember) rememberEmail(email)
    else forgetRememberedEmail()
  }

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift + clic o clic central: comportamiento nativo del enlace.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    const target = resolveBackTarget()
    if (target.kind === 'history') router.back()
    else router.push(target.href)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          href={BACK_FALLBACK_PATH}
          onClick={handleBack}
          className="-ml-2 mb-3 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-corporate-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </Link>

        <div className="rounded-2xl border bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-900/80">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold text-corporate-blue">
              Capital Consulting
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Inicia sesión en tu panel de control
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@capital.com"
                  autoComplete="username"
                  className="pl-9"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-9 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div className="flex items-center space-x-2">
                {/* El Checkbox de Radix es un <button>: necesita `checked` /
                    `onCheckedChange` en lugar de `register`. */}
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      ref={field.ref}
                      checked={field.value === true}
                      onBlur={field.onBlur}
                      onCheckedChange={(checked) => {
                        const remember = checked === true
                        field.onChange(remember)
                        // Desmarcar es una orden explícita de olvidar el
                        // usuario: se borra ya, sin esperar a otro acceso.
                        if (!remember) forgetRememberedEmail()
                      }}
                    />
                  )}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Recordar mi usuario
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button type="submit" variant="corporate" size="full" loading={isLoading}>
              Ingresar
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}