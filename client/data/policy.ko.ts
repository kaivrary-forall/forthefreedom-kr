// 정강정책 데이터

export interface PolicyCard {
  id: string
  number: string
  icon: string
  iconColor: string
  title: string
  description: string
}

export interface PolicyDetail {
  id: string
  number: string
  numberText: string
  borderColor: string
  title: string
  description: string
  items: { title: string; description: string }[]
}

export interface PolicyData {
  identity: {
    title: string
    content: string
  }
  ideology: {
    title: string
    paragraphs: string[]
  }
  background: {
    title: string
    paragraphs: string[]
  }
  policyCards: PolicyCard[]
  policyDetails: PolicyDetail[]
}

export const policyData: PolicyData = {
  identity: {
    title: '당의 정체성',
    content: '자유와혁신은 대한민국의 자유민주주의 체제, 시장경제 원칙, 그리고 법치주의를 수호하며, 지속적인 혁신을 통해 정치, 경제, 사회, 교육, 문화 등 전반의 발전을 추구하는 국민 중심의 정당이다.'
  },
  ideology: {
    title: '창당 이념 및 역사적 계승',
    paragraphs: [
      "대한민국 건국 당시, 시대의 흐름을 읽고 '자유민주주의'를 채택해 세계 자유 진영과 함께 한 이승만 대통령의 '자유' 정신과 \"우리도 할 수 있다\"고 외치면서 대한민국이 오늘날 세계 10위권의 경제 강국, 국방력 세계 5위의 부국강병 반열에 오를 수 있도록 산업화의 토대를 마련한 박정희 대통령의 '혁신' 정신을 계승한 정당이다.",
      "자유와혁신은 시대를 앞서간 선각자들의 이러한 헌신과 정신을 계승하여, 새로운 대한민국의 미래를 열어갈 것이다."
    ]
  },
  background: {
    title: '창당 배경과 목표',
    paragraphs: [
      "현재 대한민국은 물질적 풍요 속에서 일부 사회 구성원들이 국가의 근간을 위협하는 세력의 준동에 대한 경각심을 잃고 있으며, 자유민주주의 체제를 훼손하려는 시도에 적절히 대응하지 못하는 위기에 직면해 있다.",
      "이와 같은 도전 속에서 국민의 의사가 왜곡되는 상황이 발생함에도 불구하고, 국회와 정부, 그리고 일부 언론은 이러한 문제에 적극적으로 대처하지 못하고 있는 실정이다.",
      "자유와혁신은 이러한 국가적 위기를 심각하게 인식하고, 자유민주주의 수호와 국가 안정을 위한 적극적인 역할을 다할 것이다.",
      "2020년 4월 총선 이후 반복적으로 제기된 부정선거 문제에 대한 우려가 확산되면서, 이에 대한 개선을 요구하는 시민들과 청년들이 뜻을 모아 자유와혁신을 창당하기에 이르렀다."
    ]
  },
  policyCards: [
    {
      id: '1',
      number: '하나',
      icon: 'fa-balance-scale',
      iconColor: 'bg-primary',
      title: '정의, 공정, 희망을 추구하는 가치 정당',
      description: '특권과 불공정, 편법과 부정부패의 고리를 단호히 끊어내고 법 앞에 만인이 평등한 사회 구현'
    },
    {
      id: '2',
      number: '둘',
      icon: 'fa-vote-yea',
      iconColor: 'bg-blue-600',
      title: '부정선거 세력 척결',
      description: '사전투표제 폐지, 당일 투표·당일 수개표 원칙 확립으로 선거 시스템의 투명성 확보'
    },
    {
      id: '3',
      number: '셋',
      icon: 'fa-shield-alt',
      iconColor: 'bg-green-600',
      title: '반국가세력 척결 및 국가 안보 강화',
      description: '반국가세력 엄단, 국정원 대공수사권 복원, 마약청 신설로 국민 안전과 일상 보호'
    },
    {
      id: '4',
      number: '넷',
      icon: 'fa-microchip',
      iconColor: 'bg-purple-600',
      title: '4차 산업혁명 활성화를 통한 미래도약',
      description: 'AI·로봇·양자컴퓨터 등 첨단기술 강국 육성과 초격차 기술 핵심 클러스터 구축'
    },
    {
      id: '5',
      number: '다섯',
      icon: 'fa-rocket',
      iconColor: 'bg-orange-600',
      title: '청년 희망 사다리 구축',
      description: '청년 패스트트랙 마련, 내국인 역차별 금지, 사법시험 부활로 공정한 기회 보장'
    },
    {
      id: '6',
      number: '여섯',
      icon: 'fa-handshake',
      iconColor: 'bg-indigo-600',
      title: '자유 통일의 기반 구축',
      description: '통일 한국의 번영을 위한 사전 준비, 10만 통일꾼 확보 및 북한 주민 교육 프로그램'
    },
    {
      id: '7',
      number: '일곱',
      icon: 'fa-paint-brush',
      iconColor: 'bg-pink-600',
      title: '문화 융성을 통한 행복한 대한민국',
      description: '품격 있는 문화국가 실현, K-콘텐츠 전략적 수출 산업 육성으로 글로벌 문화강국 도약'
    }
  ],
  policyDetails: [
    {
      id: '1',
      number: '하나',
      numberText: '하나.',
      borderColor: 'border-primary',
      title: '정의, 공정, 희망을 추구하는 가치 정당을 지향한다',
      description: '우리는 사회의 신뢰를 회복하고 근본을 바로 세우기 위해 과거의 불의를 외면하지 않고 바로잡는다. 특권과 불공정, 편법과 부정부패의 고리를 단호히 끊어내고, 법 앞에 만인이 평등한 사회를 구현할 것이다.',
      items: [
        { title: '신뢰 회복', description: '과거의 불의를 바로잡고 기초 질서를 확립' },
        { title: '공정한 기회', description: '모든 국민에게 공정한 기회를 보장' },
        { title: '희망의 정치', description: '국민 모두가 희망을 품고 더 나은 미래를 함께 만들어가는 정치' }
      ]
    },
    {
      id: '2',
      number: '둘',
      numberText: '둘.',
      borderColor: 'border-blue-600',
      title: '부정선거세력을 척결하여 민주주의의 근간인 선거 시스템의 투명성을 확보한다',
      description: '민주주의의 근간인 선거의 공정성을 확보하여 국민의 정치적 의사가 정확히 반영되도록 한다.',
      items: [
        { title: '사전투표제 폐지', description: '사전투표제를 폐지하고, 당일 투표·당일 수개표 원칙 확립' },
        { title: '선거 감시 강화', description: '디지털 보안 강화, 독립 감시 기구 도입' },
        { title: '공정 선거법 제정', description: '불법 선거 행위에 대한 강력한 처벌 규정 마련' }
      ]
    },
    {
      id: '3',
      number: '셋',
      numberText: '셋.',
      borderColor: 'border-green-600',
      title: '국가 안보 및 사회 건전성을 강화한다',
      description: '반국가세력을 엄단하고, 국민의 안전과 일상을 지키기 위한 정책을 추진한다.',
      items: [
        { title: '반국가세력 척결', description: '반국가세력을 엄단하고 국정원 대공수사권 복원' },
        { title: '마약청 신설', description: '마약 범죄 근절을 위한 전담 기구 신설' },
        { title: '사회 안전망 강화', description: '불법 체류자 관리 및 사회 질서 확립' }
      ]
    },
    {
      id: '4',
      number: '넷',
      numberText: '넷.',
      borderColor: 'border-purple-600',
      title: '4차산업혁명 활성화를 통한 미래 도약 및 경제 강국, 초일류 정상국가를 실현한다',
      description: '첨단 기술 산업을 육성하고 민간 중심의 시장경제를 활성화하여 지속 가능한 경제 성장을 이끈다.',
      items: [
        { title: '첨단기술 강국', description: 'AI·로봇·양자컴퓨터 등 첨단 기술 강국 육성' },
        { title: '경제 활력 회복', description: '민간 중심의 활력 있는 시장경제 체제 복원' },
        { title: '지속 가능한 성장', description: '성장과 분배의 선순환 실현' }
      ]
    },
    {
      id: '5',
      number: '다섯',
      numberText: '다섯.',
      borderColor: 'border-orange-600',
      title: '청년 희망 사다리를 구축한다',
      description: '미래 사회를 이끌어갈 청년 세대에게 더 많은 기회와 도전을 제공하고 역량을 강화한다.',
      items: [
        { title: '청년 패스트트랙', description: '연공서열 문화를 불식하고 젊은 인재들이 빠르게 성장할 수 있도록 지원' },
        { title: '공정한 기회 보장', description: '내국인 역차별 금지, 외국인 우대 정책 폐지' },
        { title: '청년 정치 참여 확대', description: '사법시험 부활과 K-컬처 종사자 지원 정책 강화' }
      ]
    },
    {
      id: '6',
      number: '여섯',
      numberText: '여섯.',
      borderColor: 'border-indigo-600',
      title: '자유통일의 기반을 구축한다',
      description: '어느 순간 다가올 수 있는 통일에 대비하여 사전 준비를 철저히 하고, 통일 한국의 번영을 도모한다.',
      items: [
        { title: '통일 재정 부담 해소', description: "일정 기간 '남북 분리 관리' 방안 검토" },
        { title: '북한 주민 교육', description: '민간 차원에서 북한 주민들에게 자유민주주의 교육 프로그램 제공' },
        { title: '통일 인재 양성', description: "'10만 통일꾼' 확보 및 정기 교육, 훈련, 네트워킹 실시" }
      ]
    },
    {
      id: '7',
      number: '일곱',
      numberText: '일곱.',
      borderColor: 'border-pink-600',
      title: '문화 융성을 통한 행복한 대한민국을 실현한다',
      description: '문화가 국가 경쟁력의 핵심이자 국민 삶의 질을 결정짓는 중요한 요소임을 인식하고 문화 융성을 국가 발전의 전략 축으로 삼는다.',
      items: [
        { title: '품격 있는 문화 국가', description: '전통문화의 계승과 현대문화의 창조를 조화롭게 추진' },
        { title: '문화예술 생태계 조성', description: '문화예술인의 창작 환경 보장, 청년 문화 교육 강화' },
        { title: '글로벌 문화 강국 도약', description: 'K-콘텐츠와 관광, 한류 산업을 전략적 수출 산업으로 육성' }
      ]
    }
  ]
}
