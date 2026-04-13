import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { fetchAllUsers, updateUserRole } from '../../store/slices/adminSlice'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import { toast } from 'react-toastify'

export default function AdminUsersPage() {
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchAllUsers(undefined))
  }, [dispatch])

  const handleRoleChange = (id: number, role: 'ADMIN' | 'USER') => {
    dispatch(updateUserRole({ id, role }))
      .unwrap()
      .then(() => toast.success('User role updated'))
      .catch(() => toast.error('Failed to update role'))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Users</h1>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Joined</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">#{user.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'ADMIN' | 'USER')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium cursor-pointer ${
                      user.role === 'ADMIN'
                        ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">No users found</div>
        )}
      </div>
    </div>
  )
}
