'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { openLoginModal } = useAuth()
  
  const [form, setForm] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    nickname: '',
    email: '',
    phone: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingId, setIsCheckingId] = useState(false)
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  // 이메일 인증
  const [emailCode, setEmailCode] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [emailCodeSent, setEmailCodeSent] = useState(false)

  // 입력값 변경
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // 아이디/닉네임 변경 시 중복체크 초기화
    if (name === 'userId') {
      setIsIdAvailable(null)
    }
    if (name === 'nickname') {
      setIsNicknameAvailable(null)
    }
    // 이메일 변경 시 인증 초기화
    if (name === 'email') {
      setIsEmailVerified(false)
      setEmailCodeSent(false)
      setEmailCode('')
    }
  }

  // 아이디 유효성 검사
  const validateUserId = (value: string) => {
    if (!value) return '아이디를 입력해주세요'
    if (value.length < 4) return '아이디는 4자 이상이어야 합니다'
    if (value.length > 20) return '아이디는 20자 이하여야 합니다'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return '아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다'
    return ''
  }

  // 비밀번호 유효성 검사
  const validatePassword = (value: string) => {
    if (!value) return '비밀번호를 입력해주세요'
    if (value.length < 8) return '비밀번호는 8자 이상이어야 합니다'
    return ''
  }

  // 아이디 중복 체크
  const checkUserIdAvailable = async () => {
    const error = validateUserId(form.userId)
    if (error) {
      setErrors(prev => ({ ...prev, userId: error }))
      return
    }

    setIsCheckingId(true)
    try {
      const res = await fetch(`/api/auth/check-userid?userId=${encodeURIComponent(form.userId)}`)
      const data = await res.json()
      setIsIdAvailable(data.available)
      if (!data.available) {
        setErrors(prev => ({ ...prev, userId: '이미 사용 중인 아이디입니다' }))
      }
    } catch {
      setErrors(prev => ({ ...prev, userId: '중복 확인 중 오류가 발생했습니다' }))
    } finally {
      setIsCheckingId(false)
    }
  }

  // 닉네임 중복 체크
  const checkNicknameAvailable = async () => {
    if (!form.nickname) {
      setErrors(prev => ({ ...prev, nickname: '닉네임을 입력해주세요' }))
      return
    }

    setIsCheckingNickname(true)
    try {
      const res = await fetch(`/api/auth/check-nickname?nickname=${encodeURIComponent(form.nickname)}`)
      const data = await res.json()
      setIsNicknameAvailable(data.available)
      if (!data.available) {
        setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다' }))
      }
    } catch {
      setErrors(prev => ({ ...prev, nickname: '중복 확인 중 오류가 발생했습니다' }))
    } finally {
      setIsCheckingNickname(false)
    }
  }

  // 이메일 인증코드 발송
  const sendEmailCode = async () => {
    // 이메일 형식 검증
    if (!form.email) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요' }))
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors(prev => ({ ...prev, email: '올바른 이메일 형식이 아닙니다' }))
      return
    }

    setIsSendingCode(true)
    setErrors(prev => ({ ...prev, email: '' }))

    try {
      const res = await fetch('/api/auth/send-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      })
      const data = await res.json()

      if (data.success) {
        setEmailCodeSent(true)
        setErrors(prev => ({ ...prev, email: '' }))
      } else {
        setErrors(prev => ({ ...prev, email: data.message }))
      }
    } catch {
      setErrors(prev => ({ ...prev, email: '인증 코드 발송 중 오류가 발생했습니다' }))
    } finally {
      setIsSendingCode(false)
    }
  }

  // 이메일 인증코드 확인
  const verifyEmailCode = async () => {
    if (!emailCode) {
      setErrors(prev => ({ ...prev, emailCode: '인증 코드를 입력해주세요' }))
      return
    }

    setIsVerifyingCode(true)
    setErrors(prev => ({ ...prev, emailCode: '' }))

    try {
      const res = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: emailCode })
      })
      const data = await res.json()

      if (data.success) {
        setIsEmailVerified(true)
        setErrors(prev => ({ ...prev, emailCode: '' }))
      } else {
        setErrors(prev => ({ ...prev, emailCode: data.message }))
      }
    } catch {
      setErrors(prev => ({ ...prev, emailCode: '인증 확인 중 오류가 발생했습니다' }))
    } finally {
      setIsVerifyingCode(false)
    }
  }

  // 전화번호 포맷
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setForm(prev => ({ ...prev, phone: formatted }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }))
    }
  }

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 아이디
    const userIdError = validateUserId(form.userId)
    if (userIdError) newErrors.userId = userIdError

    // 비밀번호
    const passwordError = validatePassword(form.password)
    if (passwordError) newErrors.password = passwordError

    // 비밀번호 확인
    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호를 다시 입력해주세요'
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    }

    // 이름
    if (!form.name) newErrors.name = '이름을 입력해주세요'

    // 닉네임
    if (!form.nickname) newErrors.nickname = '닉네임을 입력해주세요'

    // 이메일
    if (!form.email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다'
    } else if (!isEmailVerified) {
      newErrors.email = '이메일 인증을 완료해주세요'
    }

    // 연락처
    if (!form.phone) {
      newErrors.phone = '연락처를 입력해주세요'
    } else if (form.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = '올바른 연락처를 입력해주세요'
    }

    // 약관 동의
    if (!form.agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요'
    }
    if (!form.agreePrivacy) {
      newErrors.agreePrivacy = '개인정보처리방침에 동의해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 회원가입 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) return

    // 중복 체크 확인
    if (isIdAvailable === null) {
      setErrors(prev => ({ ...prev, userId: '아이디 중복 확인을 해주세요' }))
      return
    }
    if (!isIdAvailable) {
      setErrors(prev => ({ ...prev, userId: '이미 사용 중인 아이디입니다' }))
      return
    }
    if (isNicknameAvailable === null) {
      setErrors(prev => ({ ...prev, nickname: '닉네임 중복 확인을 해주세요' }))
      return
    }
    if (!isNicknameAvailable) {
      setErrors(prev => ({ ...prev, nickname: '이미 사용 중인 닉네임입니다' }))
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: form.userId,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
          name: form.name,
          nickname: form.nickname,
          email: form.email,
          phone: form.phone.replace(/\D/g, ''),
          agreements: {
            terms: form.agreeTerms,
            privacy: form.agreePrivacy,
            marketing: form.agreeMarketing
          }
        })
      })

      const data = await res.json()

      if (data.success) {
        // GA4 이벤트
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'sign_up', {
            method: 'website',
            event_category: 'auth',
            event_label: 'register_success'
          })
        }
        setSubmitSuccess(true)
      } else {
        setSubmitError(data.message || '회원가입에 실패했습니다')
        
        // GA4 이벤트
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'sign_up_fail', {
            event_category: 'auth',
            event_label: data.message || 'unknown_error'
          })
        }
      }
    } catch {
      setSubmitError('회원가입 처리 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 가입 완료 화면
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check text-3xl text-green-600"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h1>
          <p className="text-gray-600 mb-6">
            회원가입이 완료되었습니다.<br />
            로그인하여 서비스를 이용해주세요.
          </p>
          <button
            onClick={() => {
              router.push('/')
              setTimeout(() => openLoginModal(), 100)
            }}
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
          >
            로그인하기
          </button>
          <Link href="/" className="block mt-4 text-sm text-gray-500 hover:text-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아이디 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="영문/숫자/밑줄 4~20자"
                  className={`flex-1 px-4 py-3 border rounded-lg outline-none transition ${
                    errors.userId ? 'border-red-500' : isIdAvailable ? 'border-green-500' : 'border-gray-300 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={checkUserIdAvailable}
                  disabled={isCheckingId}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap disabled:opacity-50"
                >
                  {isCheckingId ? '확인중...' : '중복확인'}
                </button>
              </div>
              {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId}</p>}
              {isIdAvailable && <p className="text-green-600 text-sm mt-1">사용 가능한 아이디입니다</p>}
            </div>

            {/* 비밀번호 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="8자 이상"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                  errors.passwordConfirm ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.passwordConfirm && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>}
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="실명을 입력해주세요"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                  errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* 닉네임 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="nickname"
                  value={form.nickname}
                  onChange={handleChange}
                  placeholder="활동에 사용할 닉네임"
                  className={`flex-1 px-4 py-3 border rounded-lg outline-none transition ${
                    errors.nickname ? 'border-red-500' : isNicknameAvailable ? 'border-green-500' : 'border-gray-300 focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={checkNicknameAvailable}
                  disabled={isCheckingNickname}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap disabled:opacity-50"
                >
                  {isCheckingNickname ? '확인중...' : '중복확인'}
                </button>
              </div>
              {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>}
              {isNicknameAvailable && <p className="text-green-600 text-sm mt-1">사용 가능한 닉네임입니다</p>}
            </div>

            {/* 이메일 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  disabled={isEmailVerified}
                  className={`flex-1 px-4 py-3 border rounded-lg outline-none transition ${
                    errors.email ? 'border-red-500' : isEmailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300 focus:border-primary'
                  } ${isEmailVerified ? 'cursor-not-allowed' : ''}`}
                />
                {!isEmailVerified && (
                  <button
                    type="button"
                    onClick={sendEmailCode}
                    disabled={isSendingCode || !form.email}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap disabled:opacity-50"
                  >
                    {isSendingCode ? '발송중...' : emailCodeSent ? '재발송' : '인증코드'}
                  </button>
                )}
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              {isEmailVerified && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><i className="fas fa-check-circle"></i> 이메일 인증 완료</p>}
              
              {/* 인증코드 입력 */}
              {emailCodeSent && !isEmailVerified && (
                <div className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={emailCode}
                      onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="인증코드 6자리"
                      maxLength={6}
                      className={`flex-1 px-4 py-3 border rounded-lg outline-none transition ${
                        errors.emailCode ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={verifyEmailCode}
                      disabled={isVerifyingCode || emailCode.length !== 6}
                      className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium whitespace-nowrap disabled:opacity-50"
                    >
                      {isVerifyingCode ? '확인중...' : '확인'}
                    </button>
                  </div>
                  {errors.emailCode && <p className="text-red-500 text-sm mt-1">{errors.emailCode}</p>}
                  <p className="text-xs text-gray-500 mt-1">이메일로 발송된 6자리 인증코드를 입력해주세요 (5분 유효)</p>
                </div>
              )}
            </div>

            {/* 연락처 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="010-1234-5678"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition ${
                  errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* 약관 동의 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">약관 동의</p>
              
              {/* 이용약관 */}
              <label className="flex items-start gap-3 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span>{' '}
                  <a href="/terms" target="_blank" className="text-primary hover:underline">
                    이용약관
                  </a>에 동의합니다
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-xs ml-8 -mt-2 mb-2">{errors.agreeTerms}</p>}
              
              {/* 개인정보처리방침 */}
              <label className="flex items-start gap-3 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreePrivacy"
                  checked={form.agreePrivacy}
                  onChange={handleChange}
                  className="mt-0.5 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  <span className="text-red-500">[필수]</span>{' '}
                  <a href="/privacy" target="_blank" className="text-primary hover:underline">
                    개인정보처리방침
                  </a>에 동의합니다
                </span>
              </label>
              {errors.agreePrivacy && <p className="text-red-500 text-xs ml-8 -mt-2 mb-2">{errors.agreePrivacy}</p>}
              
              {/* 마케팅 동의 */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={form.agreeMarketing}
                  onChange={handleChange}
                  className="mt-0.5 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-500">
                  [선택] 마케팅 정보 수신에 동의합니다
                </span>
              </label>
            </div>

            {/* 에러 메시지 */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {submitError}
              </div>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-spinner fa-spin"></i>
                  가입 중...
                </span>
              ) : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              onClick={openLoginModal}
              className="text-primary font-medium hover:underline"
            >
              로그인
            </button>
          </div>
        </div>

        {/* 당원가입 안내 */}
        <div className="mt-6 bg-primary/5 rounded-2xl p-6 text-center">
          <p className="text-gray-700 mb-3">
            <strong>당원</strong>으로 가입하시면 더 많은 활동에 참여할 수 있습니다
          </p>
          <a
            href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
          >
            <i className="fas fa-user-plus"></i>
            당원가입 하기
          </a>
        </div>
      </div>
    </div>
  )
}
