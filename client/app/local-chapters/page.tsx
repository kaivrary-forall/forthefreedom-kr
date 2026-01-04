'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { provinces, channelIcons, type Province } from '@/data/local-chapters'
import KoreaMap from '@/components/KoreaMap'

export default function LocalChaptersPage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [districtSearch, setDistrictSearch] = useState('')

  // URL 해시에서 시도당 ID 읽기
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && provinces.some(p => p.id === hash)) {
        setSelectedProvince(hash)
      } else if (!hash) {
        setSelectedProvince(null)
      }
    }

    // 초기 로드 시 해시 확인
    handleHashChange()

    // 해시 변경 이벤트 리스너
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // 시도당 선택 시 URL 해시 업데이트
  const handleSelectProvince = (id: string | null) => {
    setSelectedProvince(id)
    if (id) {
      window.history.pushState(null, '', `#${id}`)
    } else {
      window.history.pushState(null, '', window.location.pathname)
    }
  }

  const currentProvince = selectedProvince 
    ? provinces.find(p => p.id === selectedProvince) 
    : null

  const getStatusStyle = (status: Province['status']) => {
    switch (status) {
      case 'established':
        return 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
      case 'preparing':
        return 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
    }
  }

  const getStatusLabel = (status: Province['status']) => {
    switch (status) {
      case 'established': return ''
      case 'preparing': return '(준비중)'
      case 'inactive': return '(준비중)'
    }
  }

  return (
    <div>
      {/* 헤더 */}
      <section className="bg-white py-8 mt-16 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">시도당·당협위원회</h1>
        </div>
      </section>

      <main className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 시도당 선택 탭 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {/* 전체보기 버튼 */}
            <button
              onClick={() => handleSelectProvince(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                selectedProvince === null
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              전체보기
            </button>

            {/* 시도당 버튼들 */}
            {provinces.map((province) => (
              <button
                key={province.id}
                onClick={() => handleSelectProvince(province.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                  selectedProvince === province.id
                    ? 'bg-primary text-white border-primary'
                    : province.hasData
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-300 hover:border-yellow-500'
                      : getStatusStyle(province.status)
                }`}
              >
                {province.name}
                {province.status !== 'established' && (
                  <span className="text-xs ml-1 opacity-70">{getStatusLabel(province.status)}</span>
                )}
              </button>
            ))}
          </div>

          {/* 전체보기 모드 */}
          {selectedProvince === null && (
            <div className="space-y-8">
              {/* 지도 + 시도당 목록 */}
              <div className="text-center text-gray-600 mb-4">
                자유와혁신 시·도당 현황
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 왼쪽: 지도 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border">
                  {/* 범례 */}
                  <div className="flex justify-center gap-6 mb-6 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-green-500"></span> 창당 완료
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-yellow-500"></span> 창당준비위원회
                    </span>
                  </div>
                  
                  {/* 대한민국 지도 */}
                  <KoreaMap 
                    provinces={provinces}
                    onSelectProvince={(id) => handleSelectProvince(id)}
                  />
                </div>

                {/* 오른쪽: 카드 목록 */}
                <div className="space-y-6">
                  {/* 창당 완료 */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500"></span> 창당 완료
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {provinces.filter(p => p.status === 'established').map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProvince(p.id)}
                          className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-green-300 transition-all text-left flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-bold text-gray-900">{p.fullName}</h3>
                            {p.leader && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                {p.leaderTitle}: {p.leader}
                              </p>
                            )}
                          </div>
                          <i className="fas fa-chevron-right text-gray-300"></i>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 창당준비위원회 */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span> 창당준비위원회
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {provinces.filter(p => p.status === 'preparing').map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProvince(p.id)}
                          className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-yellow-300 transition-all text-left flex items-center justify-between"
                        >
                          <div>
                            <h3 className="font-bold text-gray-900">{p.fullName}</h3>
                            {p.leader && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                {p.leaderTitle}: {p.leader}
                              </p>
                            )}
                          </div>
                          <i className="fas fa-chevron-right text-gray-300"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 문의 안내 */}
              <div className="bg-white rounded-xl p-8 text-center border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">지역 조직 문의</h3>
                <p className="text-gray-600 mb-6">
                  각 시도당 및 당협에 대한 자세한 문의는 중앙당 조직국으로 연락해 주세요.
                </p>
                <a 
                  href="tel:02-2634-2023"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  <i className="fas fa-phone"></i>
                  02-2634-2023
                </a>
              </div>
            </div>
          )}

          {/* 개별 시도당 상세 */}
          {currentProvince && (
            <div className="space-y-8">
              {/* 시도당 정보 헤더 */}
              <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentProvince.fullName}</h2>
                    {currentProvince.officers && currentProvince.officers.length > 0 ? (
                      <div className="text-gray-600 mt-2 space-y-0.5">
                        {currentProvince.officers.map((officer, idx) => (
                          <p key={idx}>
                            {officer.title}: <span className="font-semibold">{officer.name}</span>
                          </p>
                        ))}
                      </div>
                    ) : currentProvince.leader && (
                      <p className="text-gray-600 mt-1">
                        {currentProvince.leaderTitle}: <span className="font-semibold">{currentProvince.leader}</span>
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentProvince.status === 'established' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {currentProvince.status === 'established' ? '창당 완료' : '창당준비위원회'}
                  </span>
                </div>
              </div>

              {/* 공식 채널 */}
              {currentProvince.channels && currentProvince.channels.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {currentProvince.fullName} 공식채널
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentProvince.channels.map((channel, idx) => (
                      <a
                        key={idx}
                        href={channel.disabled ? undefined : channel.url}
                        target={channel.type === 'email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className={`flex items-center gap-4 bg-white rounded-xl p-4 border-2 transition-all ${
                          channel.disabled 
                            ? 'border-gray-100 opacity-50 cursor-not-allowed' 
                            : 'border-gray-100 hover:border-primary hover:shadow-md'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          channel.type === 'kakao' ? 'bg-yellow-400' :
                          channel.type === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                          channel.type === 'youtube' ? 'bg-red-500' :
                          channel.type === 'facebook' ? 'bg-blue-600' :
                          channel.type === 'twitter' ? 'bg-black' :
                          channel.type === 'discord' ? 'bg-indigo-500' :
                          channel.type === 'threads' ? 'bg-black' :
                          channel.type === 'blog' ? 'bg-green-500' :
                          'bg-gray-500'
                        } text-white`}>
                          <i className={channelIcons[channel.type]}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{channel.name}</p>
                          {channel.description && (
                            <p className="text-sm text-primary truncate">{channel.description}</p>
                          )}
                        </div>
                        {!channel.disabled && (
                          <i className="fas fa-external-link-alt text-gray-400"></i>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 분과위원회 채팅방 */}
              {currentProvince.committees && currentProvince.committees.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {currentProvince.fullName} 분과위원회 채팅방
                  </h3>
                  <p className="text-gray-600 mb-4">당원 여러분의 적극적인 참여 부탁드립니다.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {currentProvince.committees.map((committee, idx) => (
                      <a
                        key={idx}
                        href={committee.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-yellow-400 hover:shadow-md transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                          <i className="fas fa-comment"></i>
                        </div>
                        <span className="font-medium text-gray-900">{committee.name}</span>
                        <i className="fas fa-external-link-alt text-gray-400 ml-auto"></i>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 당협위원회별 채팅방 */}
              {currentProvince.districts && currentProvince.districts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    {currentProvince.fullName} 당협위원회별 채팅방
                  </h3>
                  <p className="text-primary mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle"></i>
                    자신의 도로명 주소가 아닌, <strong>행정동 단위</strong>로 구분하여 지역구를 선택하셔야 합니다.
                  </p>
                  
                  {/* 검색 */}
                  <div className="bg-white rounded-xl p-4 border mb-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="행정동 또는 구 이름을 입력하세요 (예: 역삼1동, 강남구, 송파)"
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>

                  {/* 검색 결과 또는 전체 목록 */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentProvince.districts
                      .filter(district => {
                        if (!districtSearch.trim()) return true
                        const search = districtSearch.trim().toLowerCase()
                        // 선거구 이름으로 검색
                        if (district.name.toLowerCase().includes(search)) return true
                        // 행정동으로 검색
                        if (district.dongs?.some(dong => dong.toLowerCase().includes(search))) return true
                        return false
                      })
                      .map((district, idx) => {
                        const matchedDongs = districtSearch.trim() 
                          ? district.dongs?.filter(dong => 
                              dong.toLowerCase().includes(districtSearch.trim().toLowerCase())
                            )
                          : []
                        
                        return (
                          <a
                            key={idx}
                            href={district.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-yellow-400 hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white flex-shrink-0">
                                <i className="fas fa-comment text-sm"></i>
                              </div>
                              <span className="font-bold text-gray-900">{district.name}</span>
                              <i className="fas fa-external-link-alt text-gray-400 ml-auto"></i>
                            </div>
                            {district.chairman && (
                              <p className="text-sm text-primary font-medium ml-11 mb-1">
                                위원장: {district.chairman}
                              </p>
                            )}
                            {matchedDongs && matchedDongs.length > 0 && (
                              <p className="text-xs text-primary ml-11 mb-1">
                                검색됨: {matchedDongs.join(', ')}
                              </p>
                            )}
                            {district.dongs && (
                              <p className="text-xs text-gray-500 ml-11">
                                {district.dongs.join(', ')}
                              </p>
                            )}
                          </a>
                        )
                      })}
                  </div>

                  {/* 검색 결과 없음 */}
                  {districtSearch.trim() && currentProvince.districts.filter(district => {
                    const search = districtSearch.trim().toLowerCase()
                    if (district.name.toLowerCase().includes(search)) return true
                    if (district.dongs?.some(dong => dong.toLowerCase().includes(search))) return true
                    return false
                  }).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-search text-3xl mb-3 opacity-50"></i>
                      <p>"{districtSearch}"에 해당하는 지역구를 찾을 수 없습니다.</p>
                      <p className="text-sm mt-1">정확한 행정동명을 입력해 주세요.</p>
                    </div>
                  )}
                </div>
              )}

              {/* 채널 정보 없음 */}
              {(!currentProvince.channels || currentProvince.channels.length === 0) && (
                <div className="bg-white rounded-xl p-8 text-center border">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-info-circle text-gray-400 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">채널 정보 준비 중</h3>
                  <p className="text-gray-600 mb-6">
                    {currentProvince.fullName}의 공식 채널 정보가 준비 중입니다.<br />
                    자세한 문의는 중앙당 조직국으로 연락해 주세요.
                  </p>
                  <a 
                    href="tel:02-2634-2023"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-phone"></i>
                    02-2634-2023
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 네비게이션 */}
          <div className="mt-12 text-center">
            <Link 
              href="/about/organization"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <i className="fas fa-arrow-left"></i>
              조직도로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
