import { cn } from '@/lib/utils/cn'
import { Card as ShadCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { motion, HTMLMotionProps } from 'framer-motion'

interface CardProps extends HTMLMotionProps<'div'> {
  title?: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export function Card({
  title,
  description,
  footer,
  children,
  className,
  hoverEffect = true,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.2 }}
      className={cn('h-full', className)}
      {...props}
    >
      <ShadCard className="h-full overflow-hidden border-border/40 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/20">
        {title && (
          <CardHeader>
            <CardTitle className="font-display text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </ShadCard>
    </motion.div>
  )
}