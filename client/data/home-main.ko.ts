// 메인 페이지 히어로 슬라이더 데이터
export const bannerSlides = [
  {
    id: 1,
    title: '자유와혁신 웹사이트는\n혁신적인 공사중입니다.',
    subtitle: '',
    linkUrl: 'https://www.youtube.com/@HwangKyoahn',
    linkText: '황교안TV 시청하며 기다리기 >',
    imageUrl: '/images/hero-image.jpg',
    source: '',
  },
  {
    id: 2,
    title: '자유민주주의와 혁신을 통한\n새로운 정치',
    subtitle: '대한민국의 자유와 번영을 위해',
    linkUrl: '/about',
    linkText: '당 소개 보기',
    imageUrl: '/images/flag-pic.jpg',
    source: '',
  },
  {
    id: 3,
    title: '함께 만들어가는\n자유와혁신의 미래',
    subtitle: '당원가입으로 변화에 동참하세요',
    linkUrl: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3',
    linkText: '당원가입',
    imageUrl: '/images/activity.jpg',
    source: '',
  },
]

// 사이드 카드 데이터 (공지사항, 보도자료, 인사공고 등)
export const sideCards = [
  {
    id: 1,
    category: '공지사항',
    title: '출마자 총회',
    content: '출마자 총회 12월 26일 금요일 16:00pm, 중앙당에서 출마자 총회를 개최합니다....',
    link: '/news/notices',
    isPinned: false,
  },
  {
    id: 2,
    category: '공지사항',
    title: '[공지] 부정선거 관련 법률투쟁 모임 개최',
    content: '일시: 2025. 12. 16. 화. 오후 17시 - 장소: 자유와혁신 중앙당사 - 대상: ...',
    link: '/news/notices',
    isPinned: false,
  },
  {
    id: 3,
    category: '인사공고',
    title: '2025-00nn-01호 인사발령',
    content: '한성학을 사무부총장, 직능위원회 사무처장에 임명...',
    link: '/news/personnel',
    isPinned: false,
  },
  {
    id: 4,
    category: '보도자료',
    title: '이재명 정권은 고개를 들어 불타는 네팔 국회를 보...',
    content: '네팔에 자유의 봄이 도래했습니다. 네팔 정부의 부정부패와 sns 검열 조치에 반발한 네팔 국민들이 혁명을 일...',
    link: '/news/press-releases',
    isPinned: false,
  },
]

// 캘린더 일정 데이터
export const calendarEvents = [
  {
    id: 1,
    date: '2025-12-21',
    title: '황교안 장로 초청 간증집회',
    time: '14:00',
    location: '성광교회(유은석 목사)',
    organizer: '',
  },
  {
    id: 2,
    date: '2025-12-22',
    title: '최고위원회의(황교안TV 생중계)',
    time: '10:00',
    location: '중앙당사(사랑캠퍼스)',
    organizer: '',
  },
  {
    id: 3,
    date: '2025-12-23',
    title: '구국기도회',
    time: '10:00',
    location: '중앙당사(사랑캠퍼스)',
    organizer: '기독교위원회 주관',
  },
  {
    id: 4,
    date: '2025-12-25',
    title: '최고위원회의(황교안TV 생중계)',
    time: '10:00',
    location: '중앙당사(사랑캠퍼스)',
    organizer: '',
  },
  {
    id: 5,
    date: '2025-12-26',
    title: '당협추진위원장 임명식',
    time: '16:00',
    location: '중앙당사(사랑캠퍼스)',
    organizer: '사무처 주관',
  },
  {
    id: 6,
    date: '2025-12-27',
    title: '자유와혁신 정기 집회',
    time: '14:00',
    location: '서초 정곡빌딩',
    organizer: '투쟁위원회 주관',
  },
]

// 뉴스 프리뷰 데이터 (메인용)
export const newsPreview = [
  {
    id: 1,
    category: '공지사항',
    title: '2025년 정기 당원총회 개최 안내',
    excerpt: '2025년 정기 당원총회를 아래와 같이 개최합니다.',
    date: '2025-12-20',
    image: '/images/activity.jpg',
    link: '/news/notices',
  },
  {
    id: 2,
    category: '보도자료',
    title: '자유와혁신, 부정선거 척결을 위한 법률투쟁 선언',
    excerpt: '자유와혁신은 부정선거 척결을 위한 법률투쟁에 나섭니다.',
    date: '2025-12-18',
    image: '/images/flag-pic.jpg',
    link: '/news/press-releases',
  },
  {
    id: 3,
    category: '행사',
    title: '황교안 대표 초청 특별 간증집회',
    excerpt: '황교안 대표의 특별 간증집회가 열립니다.',
    date: '2025-12-15',
    image: '/images/night-pic.jpg',
    link: '/news/events',
  },
]
