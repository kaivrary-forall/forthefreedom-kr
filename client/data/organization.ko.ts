import { OrgChartData } from './organization.types'

export const organizationData: OrgChartData = {
  categories: [
    {
      id: 'central',
      name: '중앙당',
      independentPositions: [
        {
          id: 'leader',
          name: '당대표',
          displayName: '황교안',
          subtitle: '대한민국 제44대 국무총리',
          photoUrl: '/images/profile-pic.jpg',
          badgeColor: 'red',
          biography: '제44대 국무총리\n제43대 법무부 장관\n전 자유한국당 대표'
        }
      ],
      organizations: [
        {
          id: 'supreme-council',
          name: '최고위원회',
          color: 'red',
          positions: [
            { id: 'sc-1', name: '최고위원', displayName: '공석', badgeColor: 'gray' },
            { id: 'sc-2', name: '최고위원', displayName: '공석', badgeColor: 'gray' },
            { id: 'sc-3', name: '최고위원', displayName: '공석', badgeColor: 'gray' },
            { id: 'sc-4', name: '최고위원', displayName: '공석', badgeColor: 'gray' }
          ]
        },
        {
          id: 'secretariat',
          name: '사무처',
          color: 'blue',
          positions: [
            { id: 'sec-gen', name: '사무총장', displayName: '공석', badgeColor: 'blue' },
            { id: 'dep-sec', name: '사무부총장', displayName: '공석', badgeColor: 'blue' }
          ],
          children: [
            {
              id: 'org-dept',
              name: '조직국',
              color: 'blue',
              positions: [
                { id: 'org-dir', name: '조직국장', displayName: '공석', badgeColor: 'blue' }
              ]
            },
            {
              id: 'policy-dept',
              name: '정책국',
              color: 'blue',
              positions: [
                { id: 'policy-dir', name: '정책국장', displayName: '공석', badgeColor: 'blue' }
              ]
            }
          ]
        },
        {
          id: 'spokesperson',
          name: '대변인실',
          color: 'purple',
          positions: [
            { id: 'spokesperson-1', name: '수석대변인', displayName: '공석', badgeColor: 'purple' },
            { id: 'spokesperson-2', name: '대변인', displayName: '공석', badgeColor: 'purple' },
            { id: 'spokesperson-3', name: '대변인', displayName: '공석', badgeColor: 'purple' }
          ]
        },
        {
          id: 'research',
          name: '자유연구원',
          color: 'green',
          positions: [
            { id: 'research-dir', name: '원장', displayName: '공석', badgeColor: 'green' },
            { id: 'research-dep', name: '부원장', displayName: '공석', badgeColor: 'green' }
          ]
        }
      ]
    },
    {
      id: 'committee',
      name: '직능위원회',
      organizations: [
        {
          id: 'youth-committee',
          name: '청년위원회',
          color: 'orange',
          positions: [
            { id: 'youth-chair', name: '위원장', displayName: '공석', badgeColor: 'orange' },
            { id: 'youth-vice', name: '부위원장', displayName: '공석', badgeColor: 'orange' }
          ]
        },
        {
          id: 'women-committee',
          name: '여성위원회',
          color: 'purple',
          positions: [
            { id: 'women-chair', name: '위원장', displayName: '공석', badgeColor: 'purple' },
            { id: 'women-vice', name: '부위원장', displayName: '공석', badgeColor: 'purple' }
          ]
        },
        {
          id: 'science-committee',
          name: '과학기술정책위원회',
          color: 'blue',
          positions: [
            { id: 'sci-chair', name: '위원장', displayName: '공석', badgeColor: 'blue' }
          ]
        },
        {
          id: 'christian-committee',
          name: '기독교위원회',
          color: 'green',
          positions: [
            { id: 'chr-chair', name: '위원장', displayName: '공석', badgeColor: 'green' }
          ]
        },
        {
          id: 'volunteer',
          name: '자유행동',
          color: 'red',
          positions: [
            { id: 'vol-chair', name: '단장', displayName: '공석', badgeColor: 'red' }
          ]
        }
      ]
    },
    {
      id: 'seoul',
      name: '서울특별시당',
      independentPositions: [
        { id: 'seoul-chair', name: '위원장', displayName: '김종철', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'busan',
      name: '부산광역시당',
      independentPositions: [
        { id: 'busan-chair', name: '위원장', displayName: '서미란', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'daegu',
      name: '대구광역시당',
      independentPositions: [
        { id: 'daegu-chair', name: '위원장', displayName: '황현정', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'incheon',
      name: '인천광역시당',
      independentPositions: [
        { id: 'incheon-chair', name: '위원장', displayName: '권오용', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'gwangju',
      name: '광주광역시당',
      independentPositions: [
        { id: 'gwangju-chair', name: '위원장', displayName: '황영철', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'daejeon',
      name: '대전광역시당',
      independentPositions: [
        { id: 'daejeon-chair', name: '위원장', displayName: '김재훈', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'ulsan',
      name: '울산광역시당',
      independentPositions: [
        { id: 'ulsan-chair', name: '위원장', displayName: '지광선', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'sejong',
      name: '세종특별자치시당',
      independentPositions: [
        { id: 'sejong-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'gyeonggi',
      name: '경기도당',
      independentPositions: [
        { id: 'gyeonggi-chair', name: '위원장', displayName: '김의현', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'gangwon',
      name: '강원특별자치도당',
      independentPositions: [
        { id: 'gangwon-chair', name: '위원장', displayName: '이수동', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'chungbuk',
      name: '충청북도당',
      independentPositions: [
        { id: 'chungbuk-chair', name: '위원장', displayName: '차훈', badgeColor: 'red' }
      ],
      organizations: []
    },
    {
      id: 'chungnam',
      name: '충청남도당',
      independentPositions: [
        { id: 'chungnam-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'jeonbuk',
      name: '전북특별자치도당',
      independentPositions: [
        { id: 'jeonbuk-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'jeonnam',
      name: '전라남도당',
      independentPositions: [
        { id: 'jeonnam-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'gyeongbuk',
      name: '경상북도당',
      independentPositions: [
        { id: 'gyeongbuk-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'gyeongnam',
      name: '경상남도당',
      independentPositions: [
        { id: 'gyeongnam-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    },
    {
      id: 'jeju',
      name: '제주특별자치도당',
      independentPositions: [
        { id: 'jeju-chair', name: '위원장', displayName: '공석', badgeColor: 'gray' }
      ],
      organizations: []
    }
  ]
}

// 탭 목록
export const tabs = [
  { id: '', name: '전체' },
  { id: 'central', name: '중앙당' },
  { id: 'committee', name: '직능위원회' },
  { id: 'seoul', name: '서울' },
  { id: 'busan', name: '부산' },
  { id: 'daegu', name: '대구' },
  { id: 'incheon', name: '인천' },
  { id: 'gwangju', name: '광주' },
  { id: 'daejeon', name: '대전' },
  { id: 'ulsan', name: '울산' },
  { id: 'sejong', name: '세종' },
  { id: 'gyeonggi', name: '경기' },
  { id: 'gangwon', name: '강원' },
  { id: 'chungbuk', name: '충북' },
  { id: 'chungnam', name: '충남' },
  { id: 'jeonbuk', name: '전북' },
  { id: 'jeonnam', name: '전남' },
  { id: 'gyeongbuk', name: '경북' },
  { id: 'gyeongnam', name: '경남' },
  { id: 'jeju', name: '제주' }
]
