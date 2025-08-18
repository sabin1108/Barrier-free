export interface User {
  id: string
  email: string
  name: string
}

const AUTH_KEY = "portfolio_auth_user"

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(AUTH_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setStoredUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function login(email: string, password: string): User | null {
  if (password.length >= 6) {
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split("@")[0],
    }
    setStoredUser(user)
    return user
  }
  return null
}

export function signup(email: string, password: string, name: string): User | null {
  if (password.length >= 6 && name.length > 0) {
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
    }
    setStoredUser(user)
    return user
  }
  return null
}

export function logout(): void {
  clearStoredUser()
}
