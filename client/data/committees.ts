export interface Committee {
  slug: string
  name: string
  icon: string
  color: string
  description: string
}

export const committees: Committee[] = [
  { slug: 'youth', name: '청년위원회', icon: 'fa-running', color: '#F97316', description: '청년 세대의 목소리를 대변합니다' },
  { slug: 'women', name: '여성위원회', icon: 'fa-venus', color: '#EC4899', description: '여성의 권익 향상과 사회 참여 확대' },
  { slug: 'senior', name: '노인위원회', icon: 'fa-user-tie', color: '#6366F1', description: '어르신들의 복지와 권익 증진' },
  { slug: 'veterans', name: '재향군인위원회', icon: 'fa-shield-alt', color: '#059669', description: '국가유공자와 재향군인의 권익 보호' },
  { slug: 'christian', name: '기독교위원회', icon: 'fa-cross', color: '#8B5CF6', description: '기독교 가치 실현과 종교 자유 수호' },
  { slug: 'catholic', name: '천주교위원회', icon: 'fa-church', color: '#3B82F6', description: '천주교 신자들의 정치 참여' },
  { slug: 'buddhist', name: '불교위원회', icon: 'fa-dharmachakra', color: '#F59E0B', description: '불교 정신에 기반한 정치 실현' },
  { slug: 'education', name: '교육위원회', icon: 'fa-graduation-cap', color: '#10B981', description: '교육 정책 개선과 미래 인재 양성' },
  { slug: 'culture', name: '문화예술위원회', icon: 'fa-palette', color: '#EC4899', description: '문화예술 발전과 창작자 권익 보호' },
  { slug: 'economy', name: '경제위원회', icon: 'fa-chart-line', color: '#3B82F6', description: '경제 정책 연구와 발전 방안 모색' },
  { slug: 'local', name: '지방자치위원회', icon: 'fa-map-marked-alt', color: '#8B5CF6', description: '지방자치 발전과 지역 균형 발전' },
  { slug: 'disabled', name: '장애인위원회', icon: 'fa-wheelchair', color: '#06B6D4', description: '장애인 권익 보호와 복지 증진' },
  { slug: 'family', name: '가족위원회', icon: 'fa-home', color: '#F97316', description: '건강한 가정과 가족 가치 수호' },
  { slug: 'middleage', name: '중장년위원회', icon: 'fa-users', color: '#6366F1', description: '중장년층의 사회 참여 활성화' },
  { slug: 'college', name: '대학생위원회', icon: 'fa-university', color: '#3B82F6', description: '대학생들의 정치 참여와 역량 강화' },
  { slug: 'finance', name: '재정위원회', icon: 'fa-coins', color: '#10B981', description: '당 재정 운영의 투명성 확보' },
  { slug: 'election', name: '선거대책위원회', icon: 'fa-vote-yea', color: '#EF4444', description: '선거 전략 수립과 캠페인 운영' },
  { slug: 'international', name: '국제위원회', icon: 'fa-globe', color: '#0EA5E9', description: '국제 교류와 외교 정책 연구' },
  { slug: 'future', name: '미래전략위원회', icon: 'fa-rocket', color: '#8B5CF6', description: '미래 비전과 장기 전략 수립' },
  { slug: 'volunteer', name: '자유행동', icon: 'fa-hands-helping', color: '#F97316', description: '자원봉사와 사회공헌 활동' },
]

export function getCommittee(slug: string): Committee | undefined {
  return committees.find(c => c.slug === slug)
}
