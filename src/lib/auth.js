export const API_BASE_URL = 'http://localhost:8080'

const STORAGE_KEY = 'synex_auth'

export function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeStoredAuth(authData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
}

export function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function apiRequest(path, options = {}) {
  const auth = readStoredAuth()
  const includeAuth = options.includeAuth ?? true

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (includeAuth && auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.message || data?.error || 'Yêu cầu thất bại.'
    throw new Error(message)
  }

  return data
}