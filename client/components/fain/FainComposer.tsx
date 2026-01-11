'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface FainComposerProps {
  onPost?: (post: any) => void
  replyTo?: string
  placeholder?: string
}

export default function FainComposer({ onPost, replyTo, placeholder = "무슨 일이 일어나고 있나요?" }: FainComposerProps) {
  const { isLoggedIn, member } = useAuth()
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''
  const MAX_LENGTH = 280

  const handleSubmit = async () => {
    if (!content.trim() || isPosting) return

    setIsPosting(true)
    try {
      const token = localStorage.getItem('memberToken')
      const res = await fetch(`${API_URL}/api/fain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: content.trim(),
          images,
          replyTo
        })
      })

      const data = await res.json()
      if (data.success) {
        setContent('')
        setImages([])
        onPost?.(data.post)
      } else {
        alert(data.message || '포스트 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('포스트 작성 실패:', error)
      alert('포스트 작성 중 오류가 발생했습니다.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || images.length >= 4) return

    // TODO: 실제 이미지 업로드 구현 (Cloudinary 등)
    // 지금은 placeholder
    alert('이미지 업로드 기능은 준비 중입니다.')
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_LENGTH) {
      setContent(value)
    }

    // Auto resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="text-center py-4">
          <p className="text-gray-500 mb-3">로그인하고 글을 작성해보세요</p>
          <a
            href="/login?return=/fain"
            className="inline-block px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            로그인
          </a>
        </div>
      </div>
    )
  }

  const remainingChars = MAX_LENGTH - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 20

  return (
    <div className={`bg-white border-b border-gray-200 p-4 ${isFocused ? 'border-b-primary' : ''}`}>
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {(member as any)?.profileImage ? (
            <img
              src={(member as any).profileImage}
              alt={(member as any)?.nickname}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <i className="fas fa-user text-xl"></i>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full resize-none border-none outline-none text-xl placeholder-gray-500 min-h-[60px]"
            rows={1}
          />

          {/* 이미지 미리보기 */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden">
                  <img src={img} alt="" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full hover:bg-black/90"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 하단 툴바 */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              {/* 이미지 버튼 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 4}
                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="이미지 추가"
              >
                <i className="far fa-image text-lg"></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* GIF 버튼 */}
              <button
                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                title="GIF (준비 중)"
                disabled
              >
                <i className="fas fa-gift text-lg"></i>
              </button>

              {/* 이모지 버튼 */}
              <button
                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors opacity-50 cursor-not-allowed"
                title="이모지 (준비 중)"
                disabled
              >
                <i className="far fa-smile text-lg"></i>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* 글자 수 */}
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#e5e7eb'}
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={isOverLimit ? '#ef4444' : isNearLimit ? '#f59e0b' : '#c8102e'}
                      strokeWidth="2"
                      strokeDasharray={`${(content.length / MAX_LENGTH) * 62.83} 62.83`}
                      strokeLinecap="round"
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                  {isNearLimit && (
                    <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-amber-500'}`}>
                      {remainingChars}
                    </span>
                  )}
                </div>
              )}

              {/* 포스트 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isOverLimit || isPosting}
                className="px-5 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : replyTo ? (
                  '답글'
                ) : (
                  '게시하기'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
