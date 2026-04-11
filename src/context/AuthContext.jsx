import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest, clearStoredAuth, readStoredAuth, writeStoredAuth } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const login = async ({ email, password }) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      includeAuth: false,
      body: JSON.stringify({ email, password }),
    })

    writeStoredAuth(response)
    setAuth(response)
    return response
  }

  const logout = () => {
    clearStoredAuth()
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      auth,
      user: auth,
      isAuthenticated: Boolean(auth?.token),
      isReady,
      login,
      logout,
      setAuth,
    }),
    [auth, isReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}