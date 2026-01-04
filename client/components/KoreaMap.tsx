'use client'

import { Province } from '@/data/local-chapters'

interface KoreaMapProps {
  provinces: Province[]
  onSelectProvince: (id: string) => void
  selectedProvince?: string
}

export default function KoreaMap({ provinces, onSelectProvince, selectedProvince }: KoreaMapProps) {
  const getStatus = (id: string) => {
    const province = provinces.find(p => p.id === id)
    return province?.status || 'inactive'
  }

  const getClassName = (id: string) => {
    const status = getStatus(id)
    const isSelected = selectedProvince === id
    
    let baseClass = 'map-region cursor-pointer transition-all duration-200 hover:brightness-90'
    
    if (status === 'established') {
      baseClass += ' fill-green-500'
    } else if (status === 'preparing') {
      baseClass += ' fill-yellow-500'
    } else {
      baseClass += ' fill-gray-300'
    }
    
    if (isSelected) {
      baseClass += ' stroke-primary stroke-[3]'
    } else {
      baseClass += ' stroke-white stroke-2'
    }
    
    return baseClass
  }

  return (
    <svg viewBox="0 0 800 900" className="w-full max-w-md mx-auto">
      {/* 강원 */}
      <path 
        onClick={() => onSelectProvince('gangwon')} 
        className={getClassName('gangwon')} 
        d="M450,120 L550,100 L620,150 L600,250 L500,280 L420,240 L400,180 Z"
      >
        <title>강원</title>
      </path>
      
      {/* 경기 */}
      <path 
        onClick={() => onSelectProvince('gyeonggi')} 
        className={getClassName('gyeonggi')} 
        d="M300,180 L400,180 L420,240 L380,300 L300,320 L250,280 L260,200 Z"
      >
        <title>경기</title>
      </path>
      
      {/* 서울 */}
      <path 
        onClick={() => onSelectProvince('seoul')} 
        className={getClassName('seoul')} 
        d="M320,220 L360,220 L370,250 L340,270 L310,250 Z"
      >
        <title>서울</title>
      </path>
      
      {/* 인천 */}
      <path 
        onClick={() => onSelectProvince('incheon')} 
        className={getClassName('incheon')} 
        d="M250,230 L290,220 L300,260 L270,280 L240,260 Z"
      >
        <title>인천</title>
      </path>
      
      {/* 충북 */}
      <path 
        onClick={() => onSelectProvince('chungbuk')} 
        className={getClassName('chungbuk')} 
        d="M380,300 L500,280 L520,350 L450,400 L350,380 L340,320 Z"
      >
        <title>충북</title>
      </path>
      
      {/* 충남 */}
      <path 
        onClick={() => onSelectProvince('chungnam')} 
        className={getClassName('chungnam')} 
        d="M200,320 L300,320 L340,320 L350,380 L300,450 L200,440 L160,380 Z"
      >
        <title>충남</title>
      </path>
      
      {/* 대전 */}
      <path 
        onClick={() => onSelectProvince('daejeon')} 
        className={getClassName('daejeon')} 
        d="M300,380 L350,380 L360,420 L320,440 L290,420 Z"
      >
        <title>대전</title>
      </path>
      
      {/* 세종 */}
      <path 
        onClick={() => onSelectProvince('sejong')} 
        className={getClassName('sejong')} 
        d="M280,340 L320,340 L330,370 L300,380 L270,360 Z"
      >
        <title>세종</title>
      </path>
      
      {/* 경북 */}
      <path 
        onClick={() => onSelectProvince('gyeongbuk')} 
        className={getClassName('gyeongbuk')} 
        d="M450,400 L520,350 L600,250 L650,300 L620,420 L550,480 L450,470 Z"
      >
        <title>경북</title>
      </path>
      
      {/* 대구 */}
      <path 
        onClick={() => onSelectProvince('daegu')} 
        className={getClassName('daegu')} 
        d="M500,440 L550,420 L570,470 L530,500 L490,480 Z"
      >
        <title>대구</title>
      </path>
      
      {/* 전북 */}
      <path 
        onClick={() => onSelectProvince('jeonbuk')} 
        className={getClassName('jeonbuk')} 
        d="M200,440 L300,450 L350,500 L300,560 L200,540 L160,480 Z"
      >
        <title>전북</title>
      </path>
      
      {/* 전남 */}
      <path 
        onClick={() => onSelectProvince('jeonnam')} 
        className={getClassName('jeonnam')} 
        d="M160,540 L200,540 L300,560 L320,640 L250,700 L150,680 L120,600 Z"
      >
        <title>전남</title>
      </path>
      
      {/* 광주 */}
      <path 
        onClick={() => onSelectProvince('gwangju')} 
        className={getClassName('gwangju')} 
        d="M220,560 L270,550 L280,590 L250,610 L210,590 Z"
      >
        <title>광주</title>
      </path>
      
      {/* 경남 */}
      <path 
        onClick={() => onSelectProvince('gyeongnam')} 
        className={getClassName('gyeongnam')} 
        d="M350,500 L450,470 L550,480 L580,550 L520,620 L400,640 L320,600 Z"
      >
        <title>경남</title>
      </path>
      
      {/* 울산 */}
      <path 
        onClick={() => onSelectProvince('ulsan')} 
        className={getClassName('ulsan')} 
        d="M580,450 L650,420 L670,480 L620,520 L570,490 Z"
      >
        <title>울산</title>
      </path>
      
      {/* 부산 */}
      <path 
        onClick={() => onSelectProvince('busan')} 
        className={getClassName('busan')} 
        d="M560,550 L620,520 L660,570 L630,620 L570,610 Z"
      >
        <title>부산</title>
      </path>
      
      {/* 제주 */}
      <path 
        onClick={() => onSelectProvince('jeju')} 
        className={getClassName('jeju')} 
        d="M180,780 L300,780 L310,830 L190,830 Z"
      >
        <title>제주</title>
      </path>
      
      {/* 지역명 텍스트 */}
      <text x="490" y="180" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>강원</text>
      <text x="320" y="260" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>경기</text>
      <text x="330" y="245" className="text-xs font-bold fill-white pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>서울</text>
      <text x="253" y="255" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>인천</text>
      <text x="420" y="340" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>충북</text>
      <text x="230" y="390" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>충남</text>
      <text x="310" y="410" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>대전</text>
      <text x="285" y="360" className="text-xs font-bold fill-gray-500 pointer-events-none" style={{fontSize: '10px', fontWeight: 'bold'}}>세종</text>
      <text x="530" y="400" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>경북</text>
      <text x="515" y="470" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>대구</text>
      <text x="260" y="500" className="text-xs font-bold fill-gray-500 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>전북</text>
      <text x="200" y="620" className="text-xs font-bold fill-gray-500 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>전남</text>
      <text x="235" y="585" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>광주</text>
      <text x="430" y="560" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>경남</text>
      <text x="600" y="490" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>울산</text>
      <text x="590" y="580" className="text-xs font-bold fill-white pointer-events-none" style={{fontSize: '12px', fontWeight: 'bold'}}>부산</text>
      <text x="225" y="810" className="text-xs font-bold fill-gray-700 pointer-events-none" style={{fontSize: '14px', fontWeight: 'bold'}}>제주</text>
    </svg>
  )
}
