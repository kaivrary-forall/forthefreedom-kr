'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Member {
  _id: string
  userId: string
  nickname: string
  name?: string
  email?: string
  phone?: string
  profileImage?: string
  role?: string
  status?: string
}

interface AuthContextType {
  member: Member | null
  token: string | null
  isLoading: boolean
  isLoggedIn: boolean
  login: (userId: string, password: string) => Promise<{ success: boolean; message?: string; status?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기화 - localStorage에서 토큰 복원
  useEffect(() => {
    const savedToken = localStorage.getItem('memberToken')
    const savedMember = localStorage.getItem('memberInfo')

    if (savedToken && savedMember) {
      try {
        setToken(savedToken)
        setMember(JSON.parse(savedMember))
      } catch {
        // 파싱 실패시 초기화
        localStorage.removeItem('memberToken')
        localStorage.removeItem('memberInfo')
      }
    }
    setIsLoading(false)
  }, [])

  // 로그인
  const login = async (userId: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password })
      })

      const data = await response.json()

      if (data.success) {
        const { token: newToken, member: newMember } = data.data
        
        // 상태 저장
        setToken(newToken)
        setMember(newMember)
        
        // localStorage 저장
        localStorage.setItem('memberToken', newToken)
        localStorage.setItem('memberInfo', JSON.stringify(newMember))

        return { success: true }
      } else {
        return { 
          success: false, 
          message: data.message,
          status: data.status 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: '로그인 처리 중 오류가 발생했습니다' 
      }
    }
  }

  // 로그아웃
  const logout = () => {
    setToken(null)
    setMember(null)
    localStorage.removeItem('memberToken')
    localStorage.removeItem('memberInfo')
  }

  return (
    <AuthContext.Provider value={{
      member,
      token,
      isLoading,
      isLoggedIn: !!token && !!member,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
