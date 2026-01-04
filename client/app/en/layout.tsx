import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Freedom & Innovation | Defending Liberal Democracy',
  description: 'Freedom & Innovation is a political party that defends liberal democracy and fights against election fraud and anti-national forces.',
  keywords: 'Freedom Innovation, Korean politics, conservative party, liberal democracy',
  openGraph: {
    title: 'Freedom & Innovation',
    description: 'Defending Liberal Democracy',
    url: 'https://forthefreedom.kr/en',
    siteName: 'Freedom & Innovation',
    locale: 'en_US',
    type: 'website',
  },
}

export default function EnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
