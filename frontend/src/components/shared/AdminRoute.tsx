import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { token, user } = useAppSelector((state) => state.auth)
  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
