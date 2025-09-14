import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isOwner } from '../lib/isOwner'

export default function OwnerOnly() {
  const { user, loading } = useAuth()
  if (loading) return <div style={{padding:24}}>Loading…</div>
  if (!user || !isOwner(user.email)) return <Navigate to="/login" replace />
  return <Outlet />
}
