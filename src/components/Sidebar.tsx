import { CalendarDays, LayoutDashboard, PlusCircle, Ticket, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Eventos', icon: LayoutDashboard },
  { to: '/events/new', label: 'Crear evento', icon: PlusCircle },
  { to: '/my-events', label: 'Mis inscripciones', icon: Ticket },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600 text-primary-foreground shadow-md shadow-primary/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Mis Eventos</p>
              <p className="text-xs text-muted-foreground">Plataforma</p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
