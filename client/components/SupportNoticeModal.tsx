'use client'

import { useState, useEffect } from 'react'

export default function SupportNoticeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 세션당 한 번만 표시 (sessionStorage)
    const hasShown = sessionStorage.getItem('supportNoticeShown')
    if (!hasShown) {
      setIsOpen(true)
      sessionStorage.setItem('supportNoticeShown', 'true')
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* 모달 */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* 아이콘 */}
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📢</span>
        </div>
        
        {/* 제목 */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
          영수증 신청 안내
        </h2>
        
        {/* 내용 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-gray-800 text-center leading-relaxed">
            <strong className="text-amber-700">가명 또는 별명</strong>으로 후원금을 입금하신 분들은<br />
            영수증 신청 시 <strong className="text-amber-700">실명</strong>으로 신청해 주세요.
          </p>
        </div>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          정치자금 영수증은 법적으로 실명으로만 발급됩니다.
        </p>
        
        {/* 확인 버튼 */}
        <button
          onClick={() => setIsOpen(false)}
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          확인했습니다
        </button>
      </div>
    </div>
  )
}
