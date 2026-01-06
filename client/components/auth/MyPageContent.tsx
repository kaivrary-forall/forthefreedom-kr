'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function MyPageContent() {
  const router = useRouter()
  const { member, isLoggedIn, isLoading, logout } = useAuth()
  
  // 모달 상태
  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  
  // 폼 상태
  const [newNickname, setNewNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [nicknameError, setNicknameError] = useState('')
  const [nicknameSuccess, setNicknameSuccess] = useState('')
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  // 이메일 변경 상태
  const [emailStep, setEmailStep] = useState(1) // 1: 이메일 입력, 2: 코드 입력
  const [newEmail, setNewEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSending, setEmailSending] = useState(false)
  
  const [withdrawReason, setWithdrawReason] = useState('')
  const [withdrawPassword, setWithdrawPassword] = useState('')
  const [withdrawError, setWithdrawError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login?return=/mypage')
    }
  }, [isLoggedIn, isLoading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // 닉네임 중복 확인
  const checkNickname = async () => {
    if (!newNickname || newNickname.length < 2) {
      setNicknameError('닉네임은 2자 이상이어야 합니다')
      return
    }
    
    try {
      const res = await fetch(`${API_URL}/api/members/check-nickname?nickname=${encodeURIComponent(newNickname)}`)
      const data = await res.json()
      
      if (data.available) {
        setNicknameChecked(true)
        setNicknameSuccess('사용 가능한 닉네임입니다')
        setNicknameError('')
      } else {
        setNicknameChecked(false)
        setNicknameError('이미 사용 중인 닉네임입니다')
        setNicknameSuccess('')
      }
    } catch (error) {
      setNicknameError('확인 중 오류가 발생했습니다')
    }
  }

  // 닉네임 변경
  const changeNickname = async () => {
    if (!nicknameChecked) {
      setNicknameError('먼저 중복 확인을 해주세요')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/members/nickname`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nickname: newNickname })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('닉네임이 변경되었습니다')
        setShowNicknameModal(false)
        window.location.reload()
      } else {
        setNicknameError(data.message || '변경에 실패했습니다')
      }
    } catch (error) {
      setNicknameError('변경 중 오류가 발생했습니다')
    }
  }

  // 비밀번호 변경
  const changePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      setPasswordError('새 비밀번호가 일치하지 않습니다')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/members/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword,
          newPassword 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('비밀번호가 변경되었습니다')
        setShowPasswordModal(false)
        setCurrentPassword('')
        setNewPassword('')
        setNewPasswordConfirm('')
      } else {
        setPasswordError(data.message || '변경에 실패했습니다')
      }
    } catch (error) {
      setPasswordError('변경 중 오류가 발생했습니다')
    }
  }

  // 이메일 인증코드 요청
  const requestEmailCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('올바른 이메일 주소를 입력해주세요')
      return
    }
    
    setEmailSending(true)
    setEmailError('')
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/members/email/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail })
      })
      const data = await res.json()
      
      if (data.success) {
        setEmailStep(2)
      } else {
        setEmailError(data.message || '인증 코드 발송에 실패했습니다')
      }
    } catch (error) {
      setEmailError('인증 코드 발송 중 오류가 발생했습니다')
    } finally {
      setEmailSending(false)
    }
  }

  // 이메일 인증코드 확인 및 변경
  const verifyEmailCode = async () => {
    if (!emailCode || emailCode.length !== 6) {
      setEmailError('6자리 인증 코드를 입력해주세요')
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/members/email/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          newEmail,
          code: emailCode 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('이메일이 변경되었습니다')
        setShowEmailModal(false)
        setEmailStep(1)
        setNewEmail('')
        setEmailCode('')
        window.location.reload()
      } else {
        setEmailError(data.message || '인증에 실패했습니다')
      }
    } catch (error) {
      setEmailError('인증 중 오류가 발생했습니다')
    }
  }

  // 회원 탈퇴
  const handleWithdraw = async () => {
    if (!withdrawPassword) {
      setWithdrawError('비밀번호를 입력해주세요')
      return
    }
    
    if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/members/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          password: withdrawPassword,
          reason: withdrawReason 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        alert('회원 탈퇴가 완료되었습니다')
        logout()
        router.push('/')
      } else {
        setWithdrawError(data.message || '탈퇴에 실패했습니다')
      }
    } catch (error) {
      setWithdrawError('탈퇴 중 오류가 발생했습니다')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isLoggedIn || !member) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* 프로필 카드 */}
        <div className="bg-gradient-to-r from-primary to-red-700 text-white rounded-2xl overflow-hidden mb-6">
          <div className="flex items-stretch">
            {/* 프로필 이미지 */}
            <button 
              onClick={() => setShowProfileModal(true)}
              className="w-36 h-36 bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              {member.profileImage ? (
                <img 
                  src={member.profileImage} 
                  alt={member.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-white/80 text-5xl"></i>
              )}
            </button>
            
            {/* 정보 */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h1 className="text-2xl font-bold">{member.nickname}</h1>
              <p className="text-white/80">@{member.userId}</p>
              {member.role && (
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 text-sm rounded-full w-fit">
                  {member.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-user text-gray-400"></i> 기본 정보
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500">아이디</span>
              <span className="font-medium">{member.userId}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500">비밀번호</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">••••••••</span>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="text-sm text-primary hover:underline"
                >
                  변경
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-500">닉네임</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{member.nickname}</span>
                <button 
                  onClick={() => {
                    setNewNickname('')
                    setNicknameChecked(false)
                    setNicknameError('')
                    setNicknameSuccess('')
                    setShowNicknameModal(true)
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  변경
                </button>
              </div>
            </div>
            {member.name && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">이름</span>
                <span className="font-medium">{member.name}</span>
              </div>
            )}
            {member.email && (
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-500">이메일</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{member.email}</span>
                  <button 
                    onClick={() => {
                      setNewEmail('')
                      setEmailCode('')
                      setEmailError('')
                      setEmailStep(1)
                      setShowEmailModal(true)
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    변경
                  </button>
                </div>
              </div>
            )}
            {member.phone && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">연락처</span>
                <span className="font-medium">{member.phone}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-gray-500">상태</span>
              <span className={`font-medium ${
                member.status === 'active' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {member.status === 'active' ? '정상' : member.status}
              </span>
            </div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <Link 
            href="/profile"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-user-edit text-gray-400"></i>
              <span>프로필 수정</span>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </Link>
          <Link 
            href="/agora"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-comments text-gray-400"></i>
              <span>내 게시글</span>
            </div>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 hover:bg-gray-50 text-left"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-sign-out-alt text-red-400"></i>
              <span className="text-red-600">로그아웃</span>
            </div>
          </button>
        </div>

        {/* 아주 위험한 구역 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-gray-400"></i> 아주 위험한 구역
          </h2>
          <button
            onClick={() => {
              setWithdrawReason('')
              setWithdrawPassword('')
              setWithdrawError('')
              setShowWithdrawModal(true)
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-person-running"></i>
            <span>회원 탈퇴</span>
          </button>
        </div>

        {/* 홈으로 */}
        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-primary">
            <i className="fas fa-home mr-1"></i> 홈으로 돌아가기
          </Link>
        </div>
      </div>

      {/* 닉네임 변경 모달 */}
      {showNicknameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNicknameModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">닉네임 변경</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">새 닉네임</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newNickname}
                  onChange={(e) => {
                    setNewNickname(e.target.value)
                    setNicknameChecked(false)
                    setNicknameError('')
                    setNicknameSuccess('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="2~20자"
                />
                <button 
                  onClick={checkNickname}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm whitespace-nowrap"
                >
                  중복확인
                </button>
              </div>
              {nicknameError && <p className="text-red-500 text-sm mt-1">{nicknameError}</p>}
              {nicknameSuccess && <p className="text-green-500 text-sm mt-1">{nicknameSuccess}</p>}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNicknameModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button 
                onClick={changeNickname}
                disabled={!nicknameChecked}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPasswordModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">비밀번호 변경</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="8자 이상"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input 
                  type="password" 
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button 
                onClick={changePassword}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                변경
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 탈퇴 모달 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWithdrawModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
              <i className="fas fa-exclamation-triangle"></i> 회원 탈퇴
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">
              <p className="font-semibold mb-2">탈퇴 전 확인사항</p>
              <ul className="space-y-1">
                <li>• 혁신 당원인 경우 당비 납부가 자동 해지됩니다</li>
                <li>• 후원/구매 내역은 법적 보관 기간 동안 유지됩니다</li>
                <li>• 탈퇴 후에도 재가입이 가능합니다</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">탈퇴 사유 (선택)</label>
                <textarea 
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="탈퇴 사유를 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                <input 
                  type="password" 
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="본인 확인을 위해 비밀번호를 입력해주세요"
                />
              </div>
              {withdrawError && <p className="text-red-500 text-sm">{withdrawError}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button 
                onClick={handleWithdraw}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 변경 모달 */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEmailModal(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-4">이메일 변경</h3>
            
            {emailStep === 1 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">새 이메일 주소로 인증 코드가 발송됩니다.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">현재 이메일</label>
                    <input 
                      type="email" 
                      value={member?.email || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">새 이메일</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value)
                        setEmailError('')
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="새 이메일 주소 입력"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button 
                    onClick={requestEmailCode}
                    disabled={emailSending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:bg-gray-300"
                  >
                    {emailSending ? '발송 중...' : '인증 코드 발송'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-700">
                  <p>📧 <strong>{newEmail}</strong>으로 인증 코드를 발송했습니다.</p>
                  <p className="text-xs mt-1">10분 내로 입력해주세요.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">인증 코드 (6자리)</label>
                    <input 
                      type="text" 
                      value={emailCode}
                      onChange={(e) => {
                        setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                        setEmailError('')
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                </div>
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setEmailStep(1)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    이전
                  </button>
                  <button 
                    onClick={verifyEmailCode}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    확인
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
