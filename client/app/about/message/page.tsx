import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: '당대표 인사 | 자유와혁신',
  description: '자유와혁신 황교안 대표 인사말. 자유민주주의 수호와 혁신적 미래 비전.',
  openGraph: {
    title: '당대표 인사 | 자유와혁신',
    description: '자유와혁신 황교안 대표 인사말',
    url: 'https://forthefreedom.kr/about/message',
  },
}

export default function MessagePage() {
  return (
    <div>
      <main className="bg-white">
        <section className="py-12 sm:py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <div className="order-2 lg:order-1">
                <div className="space-y-6 border-l-4 border-primary pl-8">
                  <div className="flex items-center space-x-3">
                    <span className="text-primary font-medium text-lg tracking-wider uppercase">당 대표 인사말</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    자유민주주의 수호와<br />혁신적 미래 비전
                  </h3>
                  <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                    <p className="italic font-medium text-gray-800">
                      &quot;자유와혁신은 대한민국의 자유민주주의 체제를 수호하고, 시장경제와 법치주의를 기반으로 혁신적 미래를 선도하는 국민의 정당입니다.&quot;
                    </p>
                    <p>
                      자유와혁신은 대한민국 건국 당시, 자유민주주의를 채택하여 세계 자유진영과 함께 한 이승만 대통령의 &apos;자유&apos; 정신, 그리고 오늘날 대한민국이 부국강병 반열에 오를 수 있도록 산업화의 토대를 마련한 박정희 대통령의 &apos;혁신&apos; 정신을 계승한 정당입니다.
                    </p>
                    <p>
                      부정선거와 반국가행위를 엄단하고, 법치주의를 확립하여 국민이 안심하고 살 수 있는 나라, 4차 산업혁명을 선도하며 청년들에게 무한한 기회가 보장되는 나라를 만들겠습니다.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-gray-200">
                    <div className="flex items-end justify-between">
                      <div className="flex flex-col justify-center">
                        <p className="text-gray-600 text-sm mb-1">자유와혁신</p>
                        <p className="text-gray-900 font-bold text-2xl">당 대표</p>
                        <p className="text-gray-500 text-sm mt-1">대한민국 제 44대 국무총리</p>
                      </div>
                      <div className="w-48 h-28 flex items-center justify-center">
                        <Image
                          src="/images/signiture.PNG"
                          alt="황교안 대표 서명"
                          width={192}
                          height={112}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden border-8 border-gray-100 shadow-xl bg-gray-100">
                    <Image
                      src="/images/profile-pic.jpg"
                      alt="자유와혁신 대표 황교안"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
