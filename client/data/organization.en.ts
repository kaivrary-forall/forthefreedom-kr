import { OrgChartData } from './organization.types'

export const organizationDataEn: OrgChartData = {
  categories: [
    {
      id: 'central',
      name: 'Central Party',
      independentPositions: [
        {
          id: 'leader',
          name: 'Party Leader',
          displayName: 'Hwang Kyo-ahn',
          subtitle: '44th Prime Minister of Korea',
          photoUrl: '/images/profile-pic.jpg',
          badgeColor: 'red',
          biography: '44th Prime Minister of Korea\n43rd Minister of Justice\nFormer Leader of Liberty Korea Party'
        }
      ],
      organizations: [
        {
          id: 'supreme-council',
          name: 'Supreme Council',
          color: 'red',
          positions: [
            { id: 'sc-1', name: 'Supreme Member', displayName: 'Vacant', badgeColor: 'gray' },
            { id: 'sc-2', name: 'Supreme Member', displayName: 'Vacant', badgeColor: 'gray' },
            { id: 'sc-3', name: 'Supreme Member', displayName: 'Vacant', badgeColor: 'gray' },
            { id: 'sc-4', name: 'Supreme Member', displayName: 'Vacant', badgeColor: 'gray' }
          ]
        },
        {
          id: 'secretariat',
          name: 'Secretariat',
          color: 'blue',
          positions: [
            { id: 'sec-gen', name: 'Secretary General', displayName: 'Vacant', badgeColor: 'blue' },
            { id: 'dep-sec', name: 'Deputy Secretary', displayName: 'Vacant', badgeColor: 'blue' }
          ]
        },
        {
          id: 'spokesperson',
          name: 'Spokesperson Office',
          color: 'purple',
          positions: [
            { id: 'spokesperson-1', name: 'Chief Spokesperson', displayName: 'Vacant', badgeColor: 'purple' },
            { id: 'spokesperson-2', name: 'Spokesperson', displayName: 'Vacant', badgeColor: 'purple' },
            { id: 'spokesperson-3', name: 'Spokesperson', displayName: 'Vacant', badgeColor: 'purple' }
          ]
        }
      ]
    },
    {
      id: 'committee',
      name: 'Committees',
      organizations: [
        {
          id: 'youth-committee',
          name: 'Youth Committee',
          color: 'orange',
          positions: [
            { id: 'youth-chair', name: 'Chairman', displayName: 'Vacant', badgeColor: 'orange' }
          ]
        },
        {
          id: 'women-committee',
          name: 'Women Committee',
          color: 'purple',
          positions: [
            { id: 'women-chair', name: 'Chairman', displayName: 'Vacant', badgeColor: 'purple' }
          ]
        }
      ]
    }
  ]
}

export const tabsEn = [
  { id: '', name: 'All' },
  { id: 'central', name: 'Central' },
  { id: 'committee', name: 'Committees' }
]
