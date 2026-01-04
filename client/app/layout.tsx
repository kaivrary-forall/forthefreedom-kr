import type { Metadata } from 'next'
import './globals.css'
import { AudioProvider } from '@/contexts/AudioContext'
import { AuthProvider } from '@/contexts/AuthContext'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.forthefreedom.kr'),
  title: '자유와혁신 | 자유민주주의를 수호하는 정당',
  description: '자유와혁신은 자유민주주의 체제를 수호하고 부정선거와 반국가세력을 척결하는 혁신적 정당입니다.',
  keywords: '자유와혁신, 황교안, 보수정당, 자유민주주의, 부정선거척결',
  openGraph: {
    title: '자유와혁신',
    description: '자유민주주의를 수호하는 정당',
    url: 'https://www.forthefreedom.kr',
    siteName: '자유와혁신',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/images/favicon.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <AudioProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AudioProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
