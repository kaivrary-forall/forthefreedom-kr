import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Platform · Charter · Rules | Freedom & Innovation',
  description: 'Platform, Charter, and Rules of Freedom & Innovation party.',
  openGraph: {
    title: 'Platform · Charter · Rules | Freedom & Innovation',
    description: 'Platform, Charter, and Rules of Freedom & Innovation party.',
    url: 'https://forthefreedom.kr/en/about/principles',
  },
}

export default function PrinciplesLayoutEn({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
