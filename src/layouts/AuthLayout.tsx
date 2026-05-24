import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl animate-pulse-soft" />
        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl animate-pulse-soft" />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
        <Outlet />
      </div>
    </div>
  )
}
