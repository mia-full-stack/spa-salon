// Client-side authentication (localStorage-based since no database)
export interface User {
  id: string
  email: string
  name: string
  phone: string
  createdAt: string
}

const USERS_KEY = "spa_users"
const CURRENT_USER_KEY = "spa_current_user"

export function registerUser(email: string, password: string, name: string, phone: string): User | null {
  const users = getAllUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return null
  }

  const user: User = {
    id: `user_${email}`,
    email,
    name,
    phone,
    createdAt: new Date().toISOString(),
  }

  // Store user
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Store password separately (in real app, this would be hashed on backend)
  localStorage.setItem(`spa_password_${email}`, password)

  return user
}

export function loginUser(email: string, password: string): User | null {
  const users = getAllUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    return null
  }

  // Check password
  const storedPassword = localStorage.getItem(`spa_password_${email}`)
  if (storedPassword !== password) {
    return null
  }

  // Set current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))

  return user
}

export function logoutUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(CURRENT_USER_KEY)
  return data ? JSON.parse(data) : null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export function updateUserProfile(userId: string, updates: Partial<User>): User | null {
  const users = getAllUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex === -1) {
    return null
  }

  users[userIndex] = { ...users[userIndex], ...updates }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Update current user if it's the same user
  const currentUser = getCurrentUser()
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
  }

  return users[userIndex]
}
