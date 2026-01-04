import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '강령·당헌·당규 | 자유와혁신',
  description: '자유와혁신의 강령, 당헌, 당규. 자유민주주의와 혁신을 통한 국가 재건을 위한 당의 기본 이념과 규정.',
  openGraph: {
    title: '강령·당헌·당규 | 자유와혁신',
    description: '자유와혁신의 강령, 당헌, 당규',
    url: 'https://forthefreedom.kr/about/principles',
    images: ['/images/night-pic.jpg'],
  },
}

export default function PrinciplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
