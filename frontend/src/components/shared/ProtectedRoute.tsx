import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAppSelector((state) => state.auth)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
