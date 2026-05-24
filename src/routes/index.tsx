import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { RouteFallback } from '@/components/RouteFallback'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useAuthStore } from '@/store/auth.store'

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const EventsDashboardPage = lazy(() =>
  import('@/pages/EventsDashboardPage').then((m) => ({ default: m.EventsDashboardPage })),
)
const CreateEventPage = lazy(() =>
  import('@/pages/CreateEventPage').then((m) => ({ default: m.CreateEventPage })),
)
const EventDetailPage = lazy(() =>
  import('@/pages/EventDetailPage').then((m) => ({ default: m.EventDetailPage })),
)
const MyEventsPage = lazy(() =>
  import('@/pages/MyEventsPage').then((m) => ({ default: m.MyEventsPage })),
)

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route
            index
            element={
              <LazyPage>
                <LoginPage />
              </LazyPage>
            }
          />
        </Route>

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <AuthLayout />
            </PublicOnlyRoute>
          }
        >
          <Route
            index
            element={
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <LazyPage>
                <EventsDashboardPage />
              </LazyPage>
            }
          />
          <Route
            path="events/new"
            element={
              <LazyPage>
                <CreateEventPage />
              </LazyPage>
            }
          />
          <Route
            path="events/:eventId"
            element={
              <LazyPage>
                <EventDetailPage />
              </LazyPage>
            }
          />
          <Route
            path="my-events"
            element={
              <LazyPage>
                <MyEventsPage />
              </LazyPage>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
