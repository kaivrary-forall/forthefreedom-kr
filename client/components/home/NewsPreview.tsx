import Link from 'next/link'
import { NewsItem } from '@/data/home.ko'

interface NewsPreviewProps {
  data: NewsItem[]
  title?: string
  subtitle?: string
  viewAllText?: string
  viewAllHref?: string
  lang?: 'ko' | 'en'
}

export default function NewsPreview({ 
  data, 
  title = '자유와혁신 주요 소식',
  subtitle = '다가오는 소식을 확인하세요',
  viewAllText = '전체 소식 보기',
  viewAllHref = '/news',
  lang = 'ko'
}: NewsPreviewProps) {
  const linkPrefix = lang === 'en' ? '/en' : ''
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>
          <Link 
            href={`${linkPrefix}${viewAllHref}`}
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            {viewAllText} <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <Link
              key={item.id}
              href={`${linkPrefix}${item.href}`}
              className="block bg-white border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <span className="inline-block text-xs font-semibold text-primary bg-red-50 px-3 py-1 rounded-full mb-3">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500">{item.date}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
