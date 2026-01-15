import type { Metadata } from 'next'
import AboutTabs from '@/components/about/AboutTabs'

export const metadata: Metadata = {
  title: '창당 스토리 | 자유와혁신',
  description: '자유와혁신 창당 스토리. 대한민국의 자유민주주의를 수호하고 부정선거를 척결하기 위해 국민과 함께 걸어온 창당 여정.',
  openGraph: {
    title: '창당 스토리 | 자유와혁신',
    description: '자유와혁신 창당 스토리',
    url: 'https://forthefreedom.kr/about/founding',
    images: ['/images/night-pic.jpg'],
  },
}

const timeline = [
  {
    date: '2025년 6월 1일',
    title: '광화문 창당 선포',
    description: '광화문 이순신 장군 동상 앞에서 황교안 대통령 후보는 대통령 후보직을 내려놓고, 부정선거 척결과 주권 회복, 체제 수호를 위한 정당 창당을 국민 앞에 선포하였습니다.',
    color: 'bg-primary'
  },
  {
    date: '2025년 6월 6일',
    title: '중앙당 발기인대회',
    description: '현충일, 광화문에서 중앙당 발기인대회를 개최하고 창당 선언문을 발표했습니다. 건국정신을 계승하는 새로운 자유우파 정당의 출범을 알리는 역사적인 날이었습니다.',
    color: 'bg-primary-dark'
  },
  {
    date: '2025년 6월',
    title: '전국 시도당 발기인대회',
    description: '서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주 등 전국 17개 시도에서 발기인대회를 개최했습니다.',
    color: 'bg-red-700'
  },
  {
    date: '2025년 7월 12일',
    title: '중앙당 창당대회',
    description: '킨텍스에서 중앙당 창당대회를 개최하고 황교안 대표가 초대 당대표로 선출되었습니다. 대한민국의 자유민주주의를 수호하고 혁신적인 미래를 만들어갈 정당이 공식 출범했습니다.',
    color: 'bg-red-800'
  }
]

export default function FoundingPage() {
  return (
    <div>
      <AboutTabs active="founding" />
      
      <main className="relative z-10 bg-white">
        {/* 인트로 */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">자유와혁신 창당 스토리</h2>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed">
                대한민국의 자유민주주의를 수호하고 부정선거를 척결하기 위해 국민과 함께 걸어온 우리의 창당 여정을 소개합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 타임라인 */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* 중앙 라인 */}
              <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-1 bg-primary h-full"></div>
              
              <div className="space-y-12">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start">
                    {/* 원 */}
                    <div className="flex-shrink-0 mr-6 md:hidden">
                      <div className={`w-6 h-6 ${item.color} rounded-full border-4 border-white shadow-lg z-10`}></div>
                    </div>
                    
                    {/* 카드 */}
                    <div className="flex-1 md:w-1/2 md:ml-auto md:pl-8">
                      <div className={`bg-white p-6 md:p-8 rounded-lg shadow-lg border-l-4 ${item.color.replace('bg-', 'border-')}`}>
                        <div className="flex items-center mb-3">
                          <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                          <span className="text-primary font-bold">{item.date}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 마무리 메시지 */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-red-50 border-l-8 border-primary p-10 rounded-lg">
              <h3 className="text-3xl font-bold text-red-800 mb-6">새로운 출발</h3>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                자유와혁신은 이제 국민의 뜻을 책임 있게 대변할 실천의 정당, 승리의 정당으로 당원 여러분과 함께 앞으로 나아가겠습니다.
              </p>
              <p className="text-lg text-primary font-semibold">
                감사합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 창당 정신 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">창당 정신</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-flag text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">자유민주주의 수호</h4>
                <p className="text-gray-600">
                  건국 대통령 이승만의 자유 정신을 계승하여 대한민국의 자유민주주의 체제를 수호합니다.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">혁신과 도전</h4>
                <p className="text-gray-600">
                  박정희 대통령의 &quot;우리도 할 수 있다&quot; 정신을 이어받아 혁신적인 미래를 만들어갑니다.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-vote-yea text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">부정선거 척결</h4>
                <p className="text-gray-600">
                  투명하고 공정한 선거 시스템을 구축하여 국민의 주권을 회복합니다.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-users text-white text-2xl"></i>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">청년과 함께</h4>
                <p className="text-gray-600">
                  2030 청년들과 자유시민들이 함께 만들어가는 새로운 정치를 실현합니다.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
