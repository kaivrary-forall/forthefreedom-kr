'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface SubMenuItem {
  label: string
  href: string
  subItems?: { label: string; href: string }[]
  disabled?: boolean
}

interface MenuItem {
  label: string
  href: string
  subMenu?: SubMenuItem[]
}

export default function Navigation() {
  const pathname = usePathname()
  const isEnPage = pathname?.startsWith('/en')
  const linkPrefix = isEnPage ? '/en' : ''

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const [openSubSubMenu, setOpenSubSubMenu] = useState<string | null>(null)

  const t = isEnPage ? {
    // 메인
    about: 'About', centralParty: 'Central', localChaptersMenu: 'Local', news: 'News', agora: 'Agora',
    fain: 'FAIN', members: 'Members', support: 'Support', reportCenter: 'Report Center',
    joinParty: 'Join Party',
    // 소개
    aboutParty: 'About Us', platformCharterRules: 'Platform, Charter, Rules',
    platform: 'Platform', charter: 'Charter', rules: 'Rules',
    foundingStory: 'Founding Story', policy: 'Policy', logo: 'Logo', location: 'Location',
    // 조직
    orgChart: 'Organization', supremeCouncil: 'Supreme Council', spokesperson: 'Spokesperson',
    research: 'Research Institute', justiceGuard: 'Justice Guard', committees: 'Committees',
    volunteer: 'Freedom Action', staff: 'Staff', central: 'Central', regional: 'Regional',
    // 소식
    notices: 'Notices', statements: 'Statements', mediaCoverage: 'Media Coverage',
    events: 'Events', activities: 'Activities', cardNews: 'Card News', gallery: 'Gallery',
    personnel: 'Personnel',
    // 당원
    joinOnline: 'Join Online', joinFaq: 'FAQ',
    dues: 'Dues', education: 'Education', developing: '(Coming Soon)',
    // 후원
    supportGuide: 'Guide', receipt: 'Receipt',
  } : {
    // 메인
    about: '소개', centralParty: '중앙당', localChaptersMenu: '시도당·당협', news: '소식', agora: '아고라',
    fain: 'FAIN', members: '당원', support: '후원', reportCenter: '제보센터',
    joinParty: '당원가입',
    // 소개
    aboutParty: '당소개', platformCharterRules: '강령, 당헌, 당규',
    platform: '강령', charter: '당헌', rules: '당규',
    foundingStory: '창당 스토리', policy: '정책', logo: '로고', location: '찾아오시는길',
    // 조직
    orgChart: '조직도', supremeCouncil: '최고위원회', spokesperson: '대변인실',
    research: '자유연구원', justiceGuard: '정의수호단', committees: '직능위원회',
    volunteer: '자유행동', staff: '일꾼들', central: '중앙당', regional: '시도당',
    // 소식
    notices: '공지', statements: '성명', mediaCoverage: '언론보도',
    events: '주요일정', activities: '활동소식', cardNews: '카드뉴스', gallery: '갤러리',
    personnel: '인사공고',
    // 당원
    joinOnline: '당원가입', joinFaq: '당원가입 Q&A',
    dues: '당비납부', education: '당원교육', developing: '(개발중)',
    // 후원
    supportGuide: '후원 안내', receipt: '후원영수증',
  }

  const menuItems: MenuItem[] = [
    // 1. 소개
    { 
      label: t.about, 
      href: `${linkPrefix}/about`,
      subMenu: [
        { label: t.aboutParty, href: `${linkPrefix}/about` },
        { label: t.platformCharterRules, href: `${linkPrefix}/about/principles`, subItems: [
          { label: t.platform, href: `${linkPrefix}/about/principles#platform` },
          { label: t.charter, href: `${linkPrefix}/about/principles#charter` },
          { label: t.rules, href: `${linkPrefix}/about/principles#rules` },
        ]},
        { label: t.foundingStory, href: `${linkPrefix}/about/founding` },
        { label: t.policy, href: `${linkPrefix}/about/policy` },
        { label: t.logo, href: `${linkPrefix}/about/logo` },
        { label: t.location, href: `${linkPrefix}/about/location` },
      ]
    },
    // 2. 중앙당
    { 
      label: t.centralParty, 
      href: `${linkPrefix}/about/organization`,
      subMenu: [
        { label: t.orgChart, href: `${linkPrefix}/about/organization` },
        { label: t.supremeCouncil, href: `${linkPrefix}/about/organization?tab=central`, disabled: true },
        { label: t.spokesperson, href: `${linkPrefix}/committees/spokesperson` },
        { label: t.research, href: `${linkPrefix}/committees/research` },
        { label: t.justiceGuard, href: `${linkPrefix}/committees/justice-guard` },
        { label: t.committees, href: `${linkPrefix}/committees` },
        { label: t.volunteer, href: `${linkPrefix}/participate/volunteer` },
      ]
    },
    // 3. 시도당·당협
    { label: t.localChaptersMenu, href: `${linkPrefix}/local-chapters` },
    // 4. 소식
    { 
      label: t.news, 
      href: `${linkPrefix}/news`,
      subMenu: [
        { label: t.notices, href: `${linkPrefix}/news/notices` },
        { label: t.events, href: `${linkPrefix}/news/events` },
        { label: t.activities, href: `${linkPrefix}/news/activities` },
        { label: t.mediaCoverage, href: `${linkPrefix}/news/media` },
        { label: t.statements, href: `${linkPrefix}/news/press-releases` },
        { label: t.cardNews, href: `${linkPrefix}/news/card-news` },
        { label: t.gallery, href: `${linkPrefix}/news/gallery` },
        { label: t.personnel, href: `${linkPrefix}/news/personnel` },
      ]
    },
    // 5. 아고라
    { label: t.agora, href: `${linkPrefix}/agora` },
    // 6. FAIN
    { label: t.fain, href: `${linkPrefix}/fain` },
    // 7. 당원
    { 
      label: t.members, 
      href: `${linkPrefix}/participate`,
      subMenu: [
        { label: t.joinOnline, href: `${linkPrefix}/participate/join` },
        { label: t.joinFaq, href: `${linkPrefix}/participate/faq` },
        { label: `${t.dues} ${t.developing}`, href: '#', disabled: true },
        { label: `${t.education} ${t.developing}`, href: '#', disabled: true },
      ]
    },
    // 8. 후원
    { 
      label: t.support, 
      href: `${linkPrefix}/support`,
      subMenu: [
        { label: t.supportGuide, href: `${linkPrefix}/support` },
        { label: t.receipt, href: `${linkPrefix}/support/receipt` },
      ]
    },
    // 9. 제보센터
    { label: t.reportCenter, href: `${linkPrefix}/report-center` },
  ]

  return (
    <nav 
      className="fixed left-0 right-0 z-50 bg-white shadow-sm transition-[top] duration-200 ease-out"
      style={{ top: 'var(--top-notice-h, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href={linkPrefix || '/'} className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="자유와혁신" width={40} height={40} className="h-10 w-auto" />
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-5">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link href={item.href} className="text-gray-700 hover:text-primary font-medium text-[15px] py-4">
                  {item.label}
                </Link>

                {/* 1차 서브메뉴 */}
                {item.subMenu && (
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-48 bg-white rounded-md shadow-lg py-2">
                      {item.subMenu.map((sub) => (
                        <div key={sub.label} className="relative group/sub">
                          {sub.disabled ? (
                            <span className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
                              {sub.label}
                            </span>
                          ) : sub.subItems ? (
                            <>
                              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer">
                                {sub.label}
                                <i className="fas fa-chevron-right text-xs ml-2"></i>
                              </div>
                              {/* 2차 서브메뉴 */}
                              <div className="absolute left-full top-0 ml-1 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                <div className="w-44 bg-white rounded-md shadow-lg py-2">
                                  {sub.subItems.map((subSub) => (
                                    <Link
                                      key={subSub.label}
                                      href={subSub.href}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                    >
                                      {subSub.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </>
                          ) : (
                            <Link href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary">
                              {sub.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 언어 전환 */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Link href={pathname?.replace('/en', '') || '/'} className={`px-2 py-1 rounded ${!isEnPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}>KO</Link>
              <span className="text-gray-300">|</span>
              <Link href={`/en${pathname?.replace('/en', '') || ''}`} className={`px-2 py-1 rounded ${isEnPage ? 'bg-primary text-white' : 'text-gray-600 hover:text-primary'}`}>EN</Link>
            </div>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <Link href={item.href} className="flex-1 py-3 text-gray-700 font-medium"
                    onClick={() => !item.subMenu && setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                  {item.subMenu && (
                    <button onClick={() => setOpenSubMenu(openSubMenu === item.label ? null : item.label)} className="p-3 text-gray-500">
                      <i className={`fas fa-chevron-${openSubMenu === item.label ? 'up' : 'down'} text-xs`}></i>
                    </button>
                  )}
                </div>

                {item.subMenu && openSubMenu === item.label && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.subMenu.map((sub) => (
                      <div key={sub.label}>
                        {sub.disabled ? (
                          <span className="block py-2 text-sm text-gray-400">{sub.label}</span>
                        ) : sub.subItems ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="py-2 text-sm text-primary font-medium">{sub.label}</span>
                              <button onClick={() => setOpenSubSubMenu(openSubSubMenu === sub.label ? null : sub.label)} className="p-2 text-gray-500">
                                <i className={`fas fa-chevron-${openSubSubMenu === sub.label ? 'up' : 'down'} text-xs`}></i>
                              </button>
                            </div>
                            {openSubSubMenu === sub.label && (
                              <div className="pl-4 space-y-1">
                                {sub.subItems.map((subSub) => (
                                  <Link key={subSub.label} href={subSub.href} className="block py-2 text-sm text-gray-600 hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}>
                                    {subSub.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <Link href={sub.href} className="block py-2 text-sm text-gray-600 hover:text-primary"
                            onClick={() => setMobileMenuOpen(false)}>
                            {sub.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
