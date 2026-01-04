// 조직도 데이터 타입 - API 스키마와 호환되도록 설계

export interface Position {
  id: string
  name: string // 직책명 (당대표, 사무총장 등)
  displayName?: string // 이름 (황교안 등)
  subtitle?: string // 부제 (대한민국 제44대 국무총리 등)
  biography?: string // 약력
  photoUrl?: string // 프로필 이미지
  badgeColor?: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gray'
}

export interface Organization {
  id: string
  name: string // 조직명 (최고위원회, 사무처 등)
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'gray'
  positions: Position[]
  children?: Organization[] // 하위 조직
}

export interface OrgCategory {
  id: string
  name: string // 카테고리명 (중앙당, 직능위원회, 서울 등)
  independentPositions?: Position[] // 독립 직책 (당대표 등)
  organizations?: Organization[] // 소속 조직들
}

export interface OrgChartData {
  categories: OrgCategory[]
}
