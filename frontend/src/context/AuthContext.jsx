import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setUser(data.user || { _id: data._id, name: data.name, email: data.email, role: data.role })
      setToken(data.token)
      toast.success('Giriş başarılı')
      return data
    } catch (err) {
      const msg = err?.response?.data?.message || 'Giriş yapılamadı'
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setUser(data.user || { _id: data._id, name: data.name, email: data.email, role: data.role })
      setToken(data.token)
      toast.success('Kayıt başarılı')
      return data
    } catch (err) {
      const msg = err?.response?.data?.message || 'Kayıt başarısız'
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    toast.info('Çıkış yapıldı')
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
