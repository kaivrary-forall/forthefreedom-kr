// 메인 페이지 정적 데이터 - API 연동 시 교체 예정

export interface HeroData {
  title: string
  subtitle: string
  backgroundImage: string
  cta: {
    primary: { text: string; href: string }
    secondary: { text: string; href: string }
  }
}

export interface ValueCard {
  id: string
  icon: string
  title: string
  description: string
}

export interface NewsItem {
  id: string
  category: string
  title: string
  date: string
  href: string
}

export interface ParticipationCard {
  id: string
  icon: string
  title: string
  description: string
  linkText: string
  href: string
  external?: boolean
}

export interface GalleryItem {
  id: string
  image: string
  title: string
}

export interface HomeData {
  hero: HeroData
  values: ValueCard[]
  news: NewsItem[]
  participation: ParticipationCard[]
  gallery: GalleryItem[]
}

export const homeData: HomeData = {
  hero: {
    title: '자유와혁신',
    subtitle: '자유민주주의와 혁신을 통한 새로운 정치',
    backgroundImage: '/images/hero-image.jpg',
    cta: {
      primary: { text: '당원가입', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3' },
      secondary: { text: '당 소개', href: '/about' }
    }
  },
  values: [
    {
      id: 'democracy',
      icon: 'fa-flag',
      title: '자유민주주의 수호',
      description: '대한민국 헌법 정신에 입각한 자유민주주의 체제를 수호합니다.'
    },
    {
      id: 'election',
      icon: 'fa-vote-yea',
      title: '부정선거 척결',
      description: '투명하고 공정한 선거 시스템을 구축하여 민주주의를 지켜냅니다.'
    },
    {
      id: 'security',
      icon: 'fa-shield-alt',
      title: '반국가세력 척결',
      description: '자유민주주의를 위협하는 반국가세력을 엄단하고 국가 안보를 강화합니다.'
    },
    {
      id: 'innovation',
      icon: 'fa-rocket',
      title: '혁신과 도약',
      description: '4차 산업혁명을 선도하며 혁신적 미래를 만들어갑니다.'
    }
  ],
  news: [
    {
      id: '1',
      category: '공지사항',
      title: '자유와혁신 공식 홈페이지가 개편되었습니다',
      date: '2025.01.15',
      href: '/news'
    },
    {
      id: '2',
      category: '보도자료',
      title: '황교안 대표, 자유민주주의 수호 결의대회 개최',
      date: '2025.01.10',
      href: '/news'
    },
    {
      id: '3',
      category: '일정',
      title: '전국 시도당 창당 준비위원회 발족',
      date: '2025.01.05',
      href: '/news'
    }
  ],
  participation: [
    {
      id: 'join',
      icon: 'fa-user-plus',
      title: '당원가입',
      description: '자유와혁신의 공식 당원이 되어 정치 참여의 기회를 누리세요.',
      linkText: '가입하기',
      href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3',
      external: true
    },
    {
      id: 'support',
      icon: 'fa-hand-holding-heart',
      title: '후원하기',
      description: '정책 실현과 활동을 위한 후원에 동참해 주세요.',
      linkText: '후원하기',
      href: '/support'
    },
    {
      id: 'volunteer',
      icon: 'fa-hands-helping',
      title: '자원봉사',
      description: '다양한 자원봉사 활동으로 직접 참여하고 경험해보세요.',
      linkText: '참여하기',
      href: 'https://form.naver.com/response/MKeLmPClw_FBjrqaWJTDdw',
      external: true
    },
    {
      id: 'policy',
      icon: 'fa-lightbulb',
      title: '정책 제안',
      description: '국민의 목소리로 정책을 제안하고 발전시켜주세요.',
      linkText: '제안하기',
      href: '/report-center'
    }
  ],
  gallery: [
    { id: '1', image: '/images/activity.jpg', title: '당원 모임' },
    { id: '2', image: '/images/activity2.jpg', title: '소통 활동' },
    { id: '3', image: '/images/activity3.jpg', title: '당 활동 현장' },
    { id: '4', image: '/images/flag-pic.jpg', title: '정기 집회' },
    { id: '5', image: '/images/sit-pic.jpg', title: '회의 현장' },
    { id: '6', image: '/images/night-pic.jpg', title: '야간 집회' }
  ]
}
