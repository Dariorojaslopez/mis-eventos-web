import { LogOut, Menu, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { theme, toggleTheme } = useThemeStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu />
          </Button>
        )}
        <div>
          <p className="text-xs text-muted-foreground">Bienvenido</p>
          <p className="text-sm font-medium">{user?.full_name ?? 'Usuario'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Cambiar tema">
          {theme === 'dark' ? <Sun /> : <Moon />}
        </Button>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut />
          Salir
        </Button>
      </div>
    </header>
  )
}
