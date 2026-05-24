import { CalendarDays } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function AuthShell({ title, description, children, footer, className }: AuthShellProps) {
  return (
    <Card
      className={cn(
        'w-full max-w-md border-border/50 bg-card/80 shadow-2xl backdrop-blur-xl animate-slide-up',
        'ring-1 ring-white/10 dark:ring-white/5',
        className,
      )}
    >
      <CardHeader className="space-y-4 text-center pb-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-lg shadow-primary/25">
          <CalendarDays className="h-7 w-7" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/80">
            Mis Eventos
          </p>
          <CardTitle className="mt-1 text-2xl">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
      {footer && (
        <div className="border-t border-border/60 px-6 py-4 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  )
}

export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
    >
      {children}
    </Link>
  )
}
