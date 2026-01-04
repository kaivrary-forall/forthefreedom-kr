import Link from 'next/link'
import HeroSlider from '@/components/home/HeroSlider'
import HomeSideWidgetsAPI from '@/components/home/HomeSideWidgetsAPI'
import HomeCalendarAPI from '@/components/home/HomeCalendarAPI'
import HomeNewsAPI from '@/components/home/HomeNewsAPI'

export default function HomePage() {
  return (
    <div className="-mt-16">
      {/* Hero Section - 배너 + 사이드 카드 */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {/* 모바일: 세로 배치, 데스크톱: 가로 7:3 */}
          <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px]">
            {/* 배너 슬라이더 */}
            <div className="lg:flex-[7] h-[400px] lg:h-full">
              <HeroSlider />
            </div>
            
            {/* 사이드 카드 - API 연동 */}
            <HomeSideWidgetsAPI />
          </div>
        </div>
      </div>

      {/* 캘린더 섹션 - API 연동 */}
      <HomeCalendarAPI />

      {/* 뉴스 섹션 - API 연동 */}
      <HomeNewsAPI />

      {/* 활동 갤러리 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">자유와혁신 활동 현장</h2>
              <p className="text-gray-500 mt-1">함께 만들어가는 새로운 정치</p>
            </div>
            <Link href="/news/gallery" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
              포토갤러리 <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
          
          {/* 갤러리 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: '/images/activity.jpg', title: '당원 모임' },
              { src: '/images/activity2.jpg', title: '소통 활동' },
              { src: '/images/activity3.jpg', title: '당 활동 현장' },
              { src: '/images/flag-pic.jpg', title: '정기 집회' },
              { src: '/images/sit-pic.jpg', title: '회의 현장' },
              { src: '/images/night-pic.jpg', title: '야간 집회' },
            ].map((item, i) => (
              <div key={i} className="relative h-48 md:h-56 rounded-2xl overflow-hidden group">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold text-lg">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 참여 안내 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">자유와혁신 참여 안내</h2>
            <p className="text-gray-500 mt-1">자유와혁신의 가치에 공감하신다면 누구나 다양한 방법으로 참여하실 수 있습니다</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-user-plus text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">당원가입</h3>
              <p className="text-sm text-gray-600">자유와혁신의 가치에 동참하세요</p>
            </a>
            
            <Link 
              href="/participate/volunteer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-hands-helping text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">자유행동</h3>
              <p className="text-sm text-gray-600">함께 활동할 자원봉사자 모집</p>
            </Link>
            
            <a 
              href="https://form.naver.com/response/MKeLmPClw_FBjrqaWJTDdw" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-bullhorn text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">제보센터</h3>
              <p className="text-sm text-gray-600">부정선거 및 비리 제보</p>
            </a>
            
            <Link 
              href="/support"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">후원하기</h3>
              <p className="text-sm text-gray-600">자유민주주의를 후원해주세요</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
