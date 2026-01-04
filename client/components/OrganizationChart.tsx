'use client'

import { useState } from 'react'
import { OrgChartData, OrgCategory, Organization, Position } from '@/data/organization.types'
import OrgCard from './OrgCard'

interface OrganizationChartProps {
  data: OrgChartData
  tabs: { id: string; name: string }[]
  initialTab?: string
}

const borderColors: Record<string, string> = {
  red: 'border-red-300',
  blue: 'border-blue-300',
  green: 'border-green-300',
  purple: 'border-purple-300',
  orange: 'border-orange-300',
  gray: 'border-gray-300'
}

const titleColors: Record<string, string> = {
  red: 'text-red-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  gray: 'text-gray-600'
}

// 프로필 모달 컴포넌트
function ProfileModal({ position, onClose }: { position: Position | null; onClose: () => void }) {
  if (!position) return null
  
  const isVacant = position.displayName === '공석' || !position.displayName

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {position.photoUrl ? (
                  <img src={position.photoUrl} alt={position.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-user text-gray-400 text-2xl"></i>
                )}
              </div>
              <div>
                <span className={`inline-block text-xs px-3 py-1 rounded-full mb-1 ${
                  position.badgeColor === 'blue' ? 'bg-blue-100 text-blue-600' :
                  position.badgeColor === 'green' ? 'bg-green-100 text-green-600' :
                  position.badgeColor === 'purple' ? 'bg-purple-100 text-purple-600' :
                  position.badgeColor === 'orange' ? 'bg-orange-100 text-orange-600' :
                  position.badgeColor === 'gray' ? 'bg-gray-100 text-gray-500' :
                  'bg-red-100 text-red-600'
                }`}>
                  {position.name}
                </span>
                <h3 className={`text-2xl font-bold ${isVacant ? 'text-gray-400' : 'text-gray-900'}`}>
                  {position.displayName || '공석'}
                </h3>
                {position.subtitle && (
                  <p className="text-gray-500">{position.subtitle}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              &times;
            </button>
          </div>
          
          {position.biography && (
            <div className="mb-6">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                <i className="fas fa-user-tie text-primary mr-2"></i>약력
              </h4>
              <div className="text-gray-600 whitespace-pre-line">{position.biography}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 하위 조직 렌더링
function SubOrganization({ org, onCardClick }: { org: Organization; onCardClick: (pos: Position) => void }) {
  const colorClass = org.color || 'gray'
  
  return (
    <div className={`bg-gray-50 rounded-xl p-4 border ${borderColors[colorClass]}`}>
      <h5 className={`text-center text-sm font-bold ${titleColors[colorClass]} mb-4`}>{org.name}</h5>
      <div className="grid grid-cols-2 gap-3">
        {org.positions?.map(pos => (
          <OrgCard key={pos.id} position={pos} isSmall onClick={() => onCardClick(pos)} />
        ))}
      </div>
      {org.children && org.children.length > 0 && (
        <div className="mt-4 space-y-3">
          {org.children.map(child => (
            <SubOrganization key={child.id} org={child} onCardClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// 조직 박스 렌더링
function OrganizationBox({ org, onCardClick }: { org: Organization; onCardClick: (pos: Position) => void }) {
  const colorClass = org.color || 'red'
  
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${borderColors[colorClass]}`}>
      <h4 className={`text-center text-lg font-bold ${titleColors[colorClass]} mb-6 pb-3 border-b-2 border-opacity-30 ${borderColors[colorClass]}`}>
        {org.name}
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {org.positions?.map(pos => (
          <OrgCard key={pos.id} position={pos} onClick={() => onCardClick(pos)} />
        ))}
      </div>
      {org.children && org.children.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
          {org.children.map(child => (
            <SubOrganization key={child.id} org={child} onCardClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

// 카테고리 섹션 렌더링
function CategorySection({ category, onCardClick }: { category: OrgCategory; onCardClick: (pos: Position) => void }) {
  const hasIndependent = category.independentPositions && category.independentPositions.length > 0
  const hasOrganizations = category.organizations && category.organizations.length > 0
  
  return (
    <div className="w-full mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-red-200 flex-1"></div>
        <h3 className="text-xl font-bold text-primary px-4">{category.name}</h3>
        <div className="h-px bg-red-200 flex-1"></div>
      </div>
      
      {hasIndependent && (
        <>
          <div className="flex justify-center flex-wrap gap-6 mb-8">
            {category.independentPositions!.map(pos => (
              <OrgCard key={pos.id} position={pos} isLeader onClick={() => onCardClick(pos)} />
            ))}
          </div>
          {hasOrganizations && (
            <div className="flex justify-center mb-8">
              <div className="w-0.5 h-12 bg-primary"></div>
            </div>
          )}
        </>
      )}
      
      {hasOrganizations && (
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 flex-wrap">
          {category.organizations!.map(org => (
            <OrganizationBox key={org.id} org={org} onCardClick={onCardClick} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrganizationChart({ data, tabs, initialTab = '' }: OrganizationChartProps) {
  const [currentTab, setCurrentTab] = useState(initialTab)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  
  // 현재 탭에 해당하는 카테고리 필터링
  const filteredCategories = currentTab 
    ? data.categories.filter(cat => cat.id === currentTab)
    : data.categories

  return (
    <>
      {/* 탭 네비게이션 */}
      <section className="bg-gray-50 border-b sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-100">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  currentTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-red-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* 조직도 */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <CategorySection 
                key={category.id} 
                category={category} 
                onCardClick={setSelectedPosition}
              />
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-sitemap text-gray-400 text-3xl"></i>
              </div>
              <p className="text-gray-500 text-lg">아직 등록된 조직이 없습니다.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* 프로필 모달 */}
      {selectedPosition && (
        <ProfileModal 
          position={selectedPosition} 
          onClose={() => setSelectedPosition(null)} 
        />
      )}
    </>
  )
}
