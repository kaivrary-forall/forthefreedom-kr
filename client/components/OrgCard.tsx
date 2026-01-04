'use client'

import Image from 'next/image'
import { Position } from '@/data/organization.types'

interface OrgCardProps {
  position: Position
  isLeader?: boolean
  isSmall?: boolean
  onClick?: () => void
}

const badgeColors: Record<string, string> = {
  red: 'bg-red-100 text-red-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  gray: 'bg-gray-100 text-gray-500'
}

export default function OrgCard({ position, isLeader = false, isSmall = false, onClick }: OrgCardProps) {
  const isVacant = position.displayName === '공석' || !position.displayName
  const badgeColor = badgeColors[position.badgeColor || 'red']
  
  const cardClass = isLeader 
    ? 'bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer border-[3px] border-primary hover:shadow-xl hover:-translate-y-1 transition-all min-w-[200px]'
    : isSmall 
      ? 'bg-white rounded-lg p-3 text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all'
      : 'bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all'
  
  const imageSize = isLeader ? 'w-20 h-20' : isSmall ? 'w-10 h-10' : 'w-14 h-14'
  const nameSize = isLeader ? 'text-xl' : isSmall ? 'text-sm' : 'text-base'

  return (
    <div className={cardClass} onClick={onClick}>
      <div className={`${imageSize} mx-auto mb-2 rounded-full ${isVacant ? 'bg-gray-300' : 'bg-gray-200'} flex items-center justify-center overflow-hidden ${isLeader ? 'border-4 border-primary' : ''}`}>
        {position.photoUrl ? (
          <Image
            src={position.photoUrl}
            alt={position.displayName || ''}
            width={isLeader ? 80 : isSmall ? 40 : 56}
            height={isLeader ? 80 : isSmall ? 40 : 56}
            className="w-full h-full object-cover"
          />
        ) : (
          <i className={`fas fa-user text-gray-400 ${isLeader ? 'text-xl' : isSmall ? 'text-sm' : 'text-lg'}`}></i>
        )}
      </div>
      <span className={`inline-block ${badgeColor} text-xs px-2 py-1 rounded-full mb-1`}>
        {position.name}
      </span>
      <h3 className={`${nameSize} font-bold ${isVacant ? 'text-gray-400' : 'text-gray-900'}`}>
        {position.displayName || '공석'}
      </h3>
      {position.subtitle && isLeader && (
        <p className="text-sm text-gray-500 mt-1">{position.subtitle}</p>
      )}
    </div>
  )
}
