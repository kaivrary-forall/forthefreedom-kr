// 일정 데이터 (나중에 API로 교체)

export interface Schedule {
  id: string
  category: string
  categoryColor: string
  title: string
  date: string
  time: string
  location: string
  description?: string
}

export const schedules: Schedule[] = [
  {
    id: '1',
    category: '교육',
    categoryColor: 'bg-blue-100 text-blue-800',
    title: '신입 당원 오리엔테이션',
    date: '매월 넷째 주 토요일',
    time: '14:00 - 17:00',
    location: '당사 2층 교육장',
    description: '신규 당원을 위한 당의 역사, 정강정책, 활동 방향 안내'
  },
  {
    id: '2',
    category: '집회',
    categoryColor: 'bg-red-100 text-red-800',
    title: '자유민주주의 수호 집회',
    date: '매주 토요일',
    time: '14:00 - 18:00',
    location: '광화문 광장',
    description: '부정선거 척결과 자유민주주의 수호를 위한 평화 집회'
  },
  {
    id: '3',
    category: '회의',
    categoryColor: 'bg-purple-100 text-purple-800',
    title: '최고위원회',
    date: '매주 월요일',
    time: '10:00 - 12:00',
    location: '당사 회의실',
    description: '당 주요 현안 논의 및 의결'
  },
  {
    id: '4',
    category: '봉사',
    categoryColor: 'bg-green-100 text-green-800',
    title: '자유행동 봉사활동',
    date: '격주 일요일',
    time: '09:00 - 13:00',
    location: '서울 각 지역',
    description: '지역사회 봉사 및 주민 소통 활동'
  }
]
