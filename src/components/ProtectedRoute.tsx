import { Navigate, useLocation } from 'react-router-dom'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading, token } = useAuthStore()

  if (token && isLoading) {
    return (
      <div className="p-8">
        <LoadingSkeleton count={3} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
