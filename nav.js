// 간결한 네비게이션 컴포넌트 (피그마 디자인 적용)
function loadNavigation() {
    // 현재 경로 확인하여 하위 폴더 내부인지 감지
    const currentPath = window.location.pathname;
    // 하위 폴더들: about/, policy/, resources/, news/ 등
    const isInSubFolder = currentPath.includes('/about/') || 
                          currentPath.includes('/policy/') || 
                          currentPath.includes('/resources/') ||
                          currentPath.includes('/news/') ||
                          currentPath.split('/').length > 2; // 일반적인 하위 폴더 감지
    const pathPrefix = isInSubFolder ? '../' : '';
    
    const navigationHTML = `
        <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
            <div class="max-w-[1280px] mx-auto px-12 py-5">
                <div class="flex justify-between items-center">
                    <!-- 왼쪽: 로고 + 메뉴 -->
                    <div class="flex items-center gap-8">
                        <!-- 로고 -->
                        <a href="${pathPrefix}index.html" class="flex items-center">
                            <img src="${pathPrefix}images/logo.png" alt="자유와혁신 로고" class="h-10 w-auto">
                        </a>
                        
                        <!-- 데스크톱 메뉴 -->
                        <div class="hidden md:flex items-center gap-8">
                            <!-- 1. 소개 -->
                            <div class="relative group">
                                <a href="${pathPrefix}about.html" class="text-[#212121] hover:text-[#a50034] font-medium py-2 transition-colors duration-200 text-lg tracking-tight">
                                    소개
                                </a>
                                <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div class="py-2">
                                        <a href="${pathPrefix}about.html" title="자유와혁신 당 소개 - 황교안 대표 소개 및 당의 정체성" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당소개</a>
                                        <div class="relative group/sub">
                                            <a href="#" class="flex items-center justify-between px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">
                                                강령, 당헌, 당규 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                            </a>
                                            <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                                <div class="py-2">
                                                    <a href="${pathPrefix}about/principles.html#platform" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">강령</a>
                                                    <a href="${pathPrefix}about/principles.html#charter" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당헌</a>
                                                    <a href="${pathPrefix}about/principles.html#rules" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당규</a>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="${pathPrefix}about/founding.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">창당 스토리</a>
                                        <a href="${pathPrefix}about/organization.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">조직도</a>
                                        <div class="relative group/sub">
                                            <a href="#" class="flex items-center justify-between px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">
                                                일꾼들 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                            </a>
                                            <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                                <div class="py-2">
                                                    <a href="${pathPrefix}about/people-central.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">중앙당</a>
                                                    <a href="${pathPrefix}about/people-regional.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">시도당</a>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="${pathPrefix}about/policy.html" title="자유와혁신 정강정책 - 7대 핵심정책과 정당의 정책 방향" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">정책</a>
                                        <a href="${pathPrefix}about/logo.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">로고</a>
                                        <a href="${pathPrefix}about/location.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">찾아오시는길</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 2. 소식 -->
                            <div class="relative group">
                                <a href="${pathPrefix}news.html" title="자유와혁신 최신 소식 - 공지사항, 보도자료, 당 활동 소식" class="text-[#212121] hover:text-[#a50034] font-medium py-2 transition-colors duration-200 text-lg tracking-tight">
                                    소식
                                </a>
                                <div class="absolute left-0 top-full mt-2 w-60 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div class="py-2">
                                        <a href="${pathPrefix}news/notices.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">공지사항</a>
                                        <div class="relative group/sub">
                                            <a href="#" class="flex items-center justify-between px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">
                                                보도자료, 논평 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                            </a>
                                            <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                                <div class="py-2">
                                                    <a href="${pathPrefix}news/press-releases.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">대변인</a>
                                                    <a href="${pathPrefix}news/press-policy.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">정책위원회</a>
                                                    <a href="${pathPrefix}news/press-media.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">뉴미디어위원회</a>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="${pathPrefix}news/media.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">언론보도</a>
                                        <a href="${pathPrefix}news/events.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">주요일정</a>
                                        <div class="relative group/sub">
                                            <a href="#" class="flex items-center justify-between px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">
                                                미디어홍보 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                            </a>
                                            <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                                <div class="py-2">
                                                    <a href="${pathPrefix}news/card-news.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">카드뉴스</a>
                                                    <a href="${pathPrefix}news/gallery.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">포토갤러리</a>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="${pathPrefix}resources.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">자료실</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 3. 당원 -->
                            <div class="relative group">
                                <a href="${pathPrefix}members/join.html" class="text-[#212121] hover:text-[#a50034] font-medium py-2 transition-colors duration-200 text-lg tracking-tight">
                                    당원
                                </a>
                                <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div class="py-2">
                                        <div class="relative group/sub">
                                            <a href="#" class="flex items-center justify-between px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">
                                                당원가입안내 <i class="fas fa-chevron-right text-xs ml-2"></i>
                                            </a>
                                            <div class="absolute left-full top-0 mt-0 ml-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                                <div class="py-2">
                                                    <a href="${pathPrefix}members/join.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당원가입</a>
                                                    <a href="${pathPrefix}members/faq.html" class="block px-4 py-2 text-sm text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당원가입 FAQ</a>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="#" onclick="console.log('나의정보조회 시스템 개발중'); alert('나의정보조회 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">나의정보조회 <span class="text-xs text-gray-500">(개발중)</span></a>
                                        <a href="#" onclick="console.log('당비납부 시스템 개발중'); alert('당비납부 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당비납부 <span class="text-xs text-gray-500">(준비중)</span></a>
                                        <a href="#" onclick="console.log('당원교육 시스템 개발중'); alert('당원교육 시스템 개발중입니다.'); return false;" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">당원교육 <span class="text-xs text-gray-500">(개발중)</span></a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 4. 후원 -->
                            <div class="relative group">
                                <a href="${pathPrefix}support.html" class="text-[#212121] hover:text-[#a50034] font-medium py-2 transition-colors duration-200 text-lg tracking-tight">
                                    후원
                                </a>
                                <div class="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div class="py-2">
                                        <a href="${pathPrefix}support-guide.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">후원 안내</a>
                                        <a href="${pathPrefix}support-receipt.html" class="block px-4 py-2 text-base text-[#212121] hover:bg-gray-50 hover:text-[#a50034]">후원영수증 신청</a>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 5. 시도당 당협위원회 구성 -->
                            <div class="relative group">
                                <a href="${pathPrefix}local-chapters.html" class="text-[#212121] hover:text-[#a50034] font-medium py-2 transition-colors duration-200 text-lg tracking-tight">
                                    시도당·당협
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 오른쪽: 일수 카운터, 로그인/마이페이지 -->
                    <div class="hidden md:flex items-center gap-6">
                        <!-- 일수 카운터 -->
                        <div id="day-counter" class="flex items-center gap-2">
                            <span id="day-counter-text" class="text-[#212121] font-medium text-sm tracking-tight"></span>
                            <span id="day-counter-number" class="bg-[#a50034] text-white px-2 py-0.5 rounded font-bold text-sm"></span>
                            <span class="text-[#212121] font-medium text-sm">일째</span>
                        </div>
                        <div class="border-l border-gray-300 h-5"></div>
                        <!-- 비로그인 상태 -->
                        <div id="nav-guest" class="flex items-center gap-4">
                            <a href="${pathPrefix}login.html" class="text-[#212121] hover:text-[#a50034] text-sm transition-colors duration-200">
                                로그인
                            </a>
                            <a href="#" onclick="alert('현재 테스트 기간으로 회원가입이 일시 중단되었습니다.'); return false;" class="bg-gray-400 text-white px-4 py-1.5 rounded-full text-sm font-medium cursor-not-allowed">
                                회원가입
                            </a>
                        </div>
                        <!-- 로그인 상태 -->
                        <div id="nav-member" class="hidden flex items-center gap-4">
                            <span id="nav-nickname" class="text-[#212121] text-sm font-medium"></span>
                            <a href="#" onclick="openMypageModal(); return false;" class="text-[#a50034] hover:underline text-sm font-medium">
                                마이페이지
                            </a>
                            <button onclick="navLogout()" class="text-gray-500 hover:text-gray-700 text-sm">
                                로그아웃
                            </button>
                        </div>
                    </div>
                    
                    <!-- 모바일 메뉴 버튼 -->
                    <div class="md:hidden">
                        <button id="mobile-menu-button" onclick="toggleMobileMenu()" class="text-[#212121] hover:text-[#a50034] focus:outline-none">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- 모바일 메뉴 -->
            <div id="mobile-menu" class="md:hidden hidden border-t border-gray-200">
                    <div class="py-2 space-y-1">
                        <!-- 소개 메뉴 -->
                        <div class="mobile-menu-item">
                            <button onclick="toggleMobileSubmenu('about-submenu')" class="w-full flex items-center justify-between px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <span class="font-bold">소개</span>
                                <i class="fas fa-chevron-down transition-transform duration-200" id="about-submenu-icon"></i>
                            </button>
                            <div id="about-submenu" class="hidden bg-gray-50 border-l-4 border-red-600 ml-3">
                                <a href="${pathPrefix}about.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당소개</a>
                                <a href="${pathPrefix}about/principles.html#platform" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">강령</a>
                                <a href="${pathPrefix}about/principles.html#charter" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당헌</a>
                                <a href="${pathPrefix}about/principles.html#rules" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당규</a>
                                <a href="${pathPrefix}about/founding.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">창당 스토리</a>
                                <a href="${pathPrefix}about/organization.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">조직도</a>
                                <a href="${pathPrefix}about/people-central.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">중앙당</a>
                                <a href="${pathPrefix}about/people-regional.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">시도당</a>
                                <a href="${pathPrefix}about/policy.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">정책</a>
                                <a href="${pathPrefix}about/logo.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">로고</a>
                                <a href="${pathPrefix}about/location.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">찾아오시는길</a>
                            </div>
                        </div>
                        
                        <!-- 소식 메뉴 -->
                        <div class="mobile-menu-item">
                            <button onclick="toggleMobileSubmenu('news-submenu')" class="w-full flex items-center justify-between px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <span class="font-bold">소식</span>
                                <i class="fas fa-chevron-down transition-transform duration-200" id="news-submenu-icon"></i>
                            </button>
                            <div id="news-submenu" class="hidden bg-gray-50 border-l-4 border-red-600 ml-3">
                                <a href="${pathPrefix}news/notices.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">공지사항</a>
                                <a href="${pathPrefix}news/press-releases.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">대변인</a>
                                <a href="${pathPrefix}news/press-policy.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">정책위</a>
                                <a href="${pathPrefix}news/press-media.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">뉴미디어</a>
                                <a href="${pathPrefix}news/media.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">언론보도</a>
                                <a href="${pathPrefix}news/events.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">주요일정</a>
                                <a href="${pathPrefix}news/card-news.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">카드뉴스</a>
                                <a href="${pathPrefix}news/gallery.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">포토갤러리</a>
                                <a href="${pathPrefix}resources.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">자료실</a>
                            </div>
                        </div>
                        
                        <!-- 당원 메뉴 -->
                        <div class="mobile-menu-item">
                            <button onclick="toggleMobileSubmenu('members-submenu')" class="w-full flex items-center justify-between px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <span class="font-bold">당원</span>
                                <i class="fas fa-chevron-down transition-transform duration-200" id="members-submenu-icon"></i>
                            </button>
                            <div id="members-submenu" class="hidden bg-gray-50 border-l-4 border-red-600 ml-3">
                                <a href="${pathPrefix}members/join.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당원가입</a>
                                <a href="${pathPrefix}members/faq.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당원가입 FAQ</a>
                                <a href="#" onclick="alert('나의정보조회 시스템 개발중입니다.'); return false;" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">나의정보조회 <span class="text-xs text-gray-500">(개발중)</span></a>
                                <a href="#" onclick="alert('당비납부 시스템 개발중입니다.'); return false;" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당비납부 <span class="text-xs text-gray-500">(준비중)</span></a>
                                <a href="#" onclick="alert('당원교육 시스템 개발중입니다.'); return false;" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">당원교육 <span class="text-xs text-gray-500">(개발중)</span></a>
                            </div>
                        </div>
                        
                        <!-- 후원 메뉴 -->
                        <div class="mobile-menu-item">
                            <button onclick="toggleMobileSubmenu('support-submenu')" class="w-full flex items-center justify-between px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <span class="font-bold">후원</span>
                                <i class="fas fa-chevron-down transition-transform duration-200" id="support-submenu-icon"></i>
                            </button>
                            <div id="support-submenu" class="hidden bg-gray-50 border-l-4 border-red-600 ml-3">
                                <a href="${pathPrefix}support-guide.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">후원 안내</a>
                                <a href="${pathPrefix}support-receipt.html" class="block px-6 py-2 text-base text-gray-600 hover:bg-gray-100 hover:text-red-600">후원영수증 신청</a>
                            </div>
                        </div>
                        
                        <!-- 시도당·당협 메뉴 -->
                        <div class="mobile-menu-item">
                            <a href="${pathPrefix}local-chapters.html" class="w-full flex items-center justify-between px-3 py-2 text-lg text-gray-700 hover:bg-gray-50 hover:text-red-600">
                                <span class="font-bold">시도당·당협</span>
                            </a>
                        </div>
                        
                        <!-- 로그인/회원 영역 -->
                        <div class="pt-4 px-3 border-t border-gray-200 mt-4">
                            <!-- 비로그인 상태 -->
                            <div id="mobile-nav-guest" class="flex gap-2">
                                <a href="${pathPrefix}login.html" class="flex-1 bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    로그인
                                </a>
                                <a href="#" onclick="alert('현재 테스트 기간으로 회원가입이 일시 중단되었습니다.'); return false;" class="flex-1 bg-gray-400 text-white text-center py-3 rounded-lg font-bold cursor-not-allowed">
                                    회원가입
                                </a>
                            </div>
                            <!-- 로그인 상태 -->
                            <div id="mobile-nav-member" class="hidden">
                                <div class="flex items-center justify-between mb-2">
                                    <span id="mobile-nav-nickname" class="font-medium text-gray-900"></span>
                                    <button onclick="navLogout()" class="text-sm text-gray-500 hover:text-red-600">로그아웃</button>
                                </div>
                                <a href="#" onclick="openMypageModal(); toggleMobileMenu(); return false;" class="block w-full bg-[#a50034] text-white text-center py-3 rounded-lg font-bold hover:bg-[#8B002C] transition-colors">
                                    마이페이지
                                </a>
                            </div>
                        </div>
                        
                        <!-- 당원가입 버튼 -->
                        <div class="pt-3 px-3">
                            <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" class="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                                당원가입
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHTML;
        
        // 로그인 상태 체크
        checkLoginStatus();
        
        // 모바일 메뉴 토글
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            // The toggleMobileMenu function is now directly on the button
            // mobileMenuButton.addEventListener('click', toggleMobileMenu); 
        }
        
        // 플로팅 버튼 추가 (초기에는 숨김 상태)
        const floatingButtons = `
            <!-- 플로팅 버튼들 -->
            <div class="fixed bottom-6 right-6 z-40 flex flex-col space-y-3 opacity-0 transition-opacity duration-300" id="floating-buttons">
                <!-- 당원가입 버튼 -->
                <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
                   target="_blank"
                   class="floating-btn bg-red-600 hover:bg-red-700 text-white shadow-lg"
                   title="당원가입">
                    <i class="fas fa-user-plus mr-2"></i>
                    <span class="hidden sm:inline">당원가입</span>
                    <span class="sm:hidden">가입</span>
                </a>
                
                <!-- 후원영수증 신청 버튼 -->
                <a href="${pathPrefix}support-receipt.html" 
                   class="floating-btn bg-green-600 hover:bg-green-700 text-white shadow-lg"
                   title="후원영수증 신청">
                    <i class="fas fa-receipt mr-2"></i>
                    <span class="hidden sm:inline">영수증신청</span>
                    <span class="sm:hidden">영수증</span>
                </a>
                
                <!-- 후원하기 버튼 -->
                <a href="${pathPrefix}support.html" 
                   class="floating-btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                   title="후원하기">
                    <i class="fas fa-heart mr-2"></i>
                    <span class="hidden sm:inline">후원하기</span>
                    <span class="sm:hidden">후원</span>
                </a>
            </div>
            
            <style>
            /* 로고 완전 투명 처리 */
            .logo-transparent {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            /* 네비게이션에서도 투명 유지 */
            nav .logo-transparent {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                backdrop-filter: none !important;
            }
            
            .floating-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 12px 16px;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 500;
                font-size: 14px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                min-width: 60px;
            }
            
            .floating-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 640px) {
                .floating-btn {
                    padding: 10px 12px;
                    font-size: 12px;
                    min-width: 50px;
                }
            }
            
            /* 모바일에서 하단 여백 조정 */
            @media (max-width: 768px) {
                #floating-buttons {
                    bottom: 80px !important;
                }
            }
            </style>
        `;
        
        // 기존 플로팅 버튼이 있으면 제거 (중복 방지)
        const existingFloatingButtons = document.getElementById('floating-buttons');
        if (existingFloatingButtons) {
            existingFloatingButtons.remove();
        }
        
        // body에 플로팅 버튼 추가
        document.body.insertAdjacentHTML('beforeend', floatingButtons);
        
        // 스크롤 이벤트로 플로팅 버튼 표시/숨김 제어
        const floatingButtonsElement = document.getElementById('floating-buttons');
        const navigationElement = document.querySelector('nav');
        
        if (floatingButtonsElement && navigationElement) {
            // 스크롤 이벤트 리스너 추가
            let ticking = false;
            
            function updateFloatingButtons() {
                const scrollY = window.scrollY || window.pageYOffset;
                
                if (scrollY < 200) {
                    // 스크롤이 200px 미만이면 플로팅 버튼 숨김
                    floatingButtonsElement.style.opacity = '0';
                    floatingButtonsElement.style.pointerEvents = 'none';
                } else {
                    // 스크롤이 200px 이상이면 플로팅 버튼 표시
                    floatingButtonsElement.style.opacity = '1';
                    floatingButtonsElement.style.pointerEvents = 'auto';
                }
                
                ticking = false;
            }
            
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateFloatingButtons);
                    ticking = true;
                }
            }
            
            // 스크롤 이벤트 등록
            window.addEventListener('scroll', requestTick);
            
            // 초기 상태 설정
            updateFloatingButtons();
        }
    }
}

// 모바일 메뉴 토글 기능
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && menuButton) {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            menuButton.innerHTML = '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
        } else {
            mobileMenu.classList.add('hidden');
            menuButton.innerHTML = '<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
        }
    }
}

// 모바일 서브메뉴 토글 기능
function toggleMobileSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    const icon = document.getElementById(submenuId + '-icon');
    
    if (submenu && icon) {
        if (submenu.classList.contains('hidden')) {
            // 모든 다른 서브메뉴 닫기
            document.querySelectorAll('[id$="-submenu"]').forEach(menu => {
                if (menu.id !== submenuId) {
                    menu.classList.add('hidden');
                }
            });
            document.querySelectorAll('[id$="-submenu-icon"]').forEach(iconEl => {
                if (iconEl.id !== submenuId + '-icon') {
                    iconEl.style.transform = 'rotate(0deg)';
                }
            });
            
            // 현재 서브메뉴 열기
            submenu.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            // 현재 서브메뉴 닫기
            submenu.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// 전역 함수로 등록
window.toggleMobileMenu = toggleMobileMenu;
window.toggleMobileSubmenu = toggleMobileSubmenu;

// 로그인 상태 체크
function checkLoginStatus() {
    const token = localStorage.getItem('memberToken');
    const memberInfo = JSON.parse(localStorage.getItem('memberInfo') || '{}');
    
    // 데스크톱 네비게이션
    const navGuest = document.getElementById('nav-guest');
    const navMember = document.getElementById('nav-member');
    const navNickname = document.getElementById('nav-nickname');
    
    // 모바일 네비게이션
    const mobileNavGuest = document.getElementById('mobile-nav-guest');
    const mobileNavMember = document.getElementById('mobile-nav-member');
    const mobileNavNickname = document.getElementById('mobile-nav-nickname');
    
    // 일수 카운터
    const dayCounterText = document.getElementById('day-counter-text');
    const dayCounterNumber = document.getElementById('day-counter-number');
    
    if (token && memberInfo.nickname) {
        // 로그인 상태
        if (navGuest) navGuest.classList.add('hidden');
        if (navMember) {
            navMember.classList.remove('hidden');
            navMember.classList.add('flex');
        }
        if (navNickname) navNickname.textContent = memberInfo.nickname + '님';
        
        if (mobileNavGuest) mobileNavGuest.classList.add('hidden');
        if (mobileNavMember) mobileNavMember.classList.remove('hidden');
        if (mobileNavNickname) mobileNavNickname.textContent = memberInfo.nickname + '님';
        
        // 일수 카운터 - 회원가입일 기준
        if (dayCounterText && dayCounterNumber) {
            if (memberInfo.appliedAt) {
                const joinDate = new Date(memberInfo.appliedAt);
                const today = new Date();
                const diffTime = today - joinDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                dayCounterText.textContent = '자유와혁신과 함께한 지';
                dayCounterNumber.textContent = diffDays.toLocaleString();
            } else {
                // appliedAt이 없으면 창당일 기준
                const foundingDate = new Date('2025-07-12');
                const today = new Date();
                const diffTime = today - foundingDate;
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                dayCounterText.textContent = '자유와혁신과 함께한 지';
                if (diffDays <= 0) {
                    dayCounterNumber.textContent = 'D' + diffDays;
                } else {
                    dayCounterNumber.textContent = diffDays.toLocaleString();
                }
            }
        }
    } else {
        // 비로그인 상태
        if (navGuest) navGuest.classList.remove('hidden');
        if (navMember) {
            navMember.classList.add('hidden');
            navMember.classList.remove('flex');
        }
        
        if (mobileNavGuest) mobileNavGuest.classList.remove('hidden');
        if (mobileNavMember) mobileNavMember.classList.add('hidden');
        
        // 일수 카운터 - 창당일(2025.07.12) 기준
        if (dayCounterText && dayCounterNumber) {
            const foundingDate = new Date('2025-07-12');
            const today = new Date();
            const diffTime = today - foundingDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            dayCounterText.textContent = '자유와혁신의 발걸음,';
            // 창당일 전이면 D-day 표시
            if (diffDays <= 0) {
                dayCounterNumber.textContent = 'D' + diffDays;
            } else {
                dayCounterNumber.textContent = diffDays.toLocaleString();
            }
        }
    }
}

// 네비게이션 로그아웃
function navLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberInfo');
        window.location.reload();
    }
}


// ========== 마이페이지 모달 시스템 ==========
let mypageMemberData = null;
let mypageNicknameChecked = false;
let pendingNewEmail = '';

function openMypageModal() {
    if (!document.getElementById('mypageModal')) {
        createMypageModal();
    }
    document.getElementById('mypageModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    loadMypageInfo();
}

function closeMypageModal() {
    const modal = document.getElementById('mypageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createMypageModal() {
    const modalHTML = `
    <div id="mypageModal" class="mp-modal">
        <div class="mp-modal-overlay" onclick="closeMypageModal()"></div>
        <div class="mp-modal-container">
            <div class="mp-modal-header">
                <h2>마이페이지</h2>
                <button onclick="closeMypageModal()" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-modal-body" id="mypageModalBody">
                <div class="mp-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>정보를 불러오는 중...</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 정보 수정 서브모달 -->
    <div id="mpEditModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpEditModal')"></div>
        <div class="mp-submodal-content">
            <div class="mp-submodal-header">
                <h3>기본 정보 수정</h3>
                <button onclick="closeMpSubModal('mpEditModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <form id="mpEditForm" onsubmit="mpSaveInfo(event)">
                    <div class="mp-form-group">
                        <label>이름 <span class="mp-hint">(변경 불가)</span></label>
                        <input type="text" id="mpEditName" class="mp-input" readonly style="background:#f3f4f6;color:#6b7280;">
                    </div>
                    <div class="mp-form-group">
                        <label>이메일 <span class="mp-hint">(별도 인증 필요)</span></label>
                        <div class="mp-input-row">
                            <input type="email" id="mpEditEmail" class="mp-input" readonly style="background:#f3f4f6;color:#6b7280;">
                            <button type="button" onclick="openMpEmailModal()" class="mp-btn-sm">변경</button>
                        </div>
                    </div>
                    <div class="mp-form-group">
                        <label>연락처</label>
                        <input type="tel" id="mpEditPhone" class="mp-input" required>
                    </div>
                    <div class="mp-form-group">
                        <label>주소</label>
                        <div class="mp-input-row">
                            <input type="text" id="mpEditZipCode" class="mp-input" style="width:100px;" placeholder="우편번호" readonly>
                            <button type="button" onclick="mpSearchAddress()" class="mp-btn-sm">주소검색</button>
                        </div>
                        <input type="text" id="mpEditAddress" class="mp-input" placeholder="기본주소" readonly style="margin-top:8px;">
                        <input type="hidden" id="mpEditAddressDong">
                        <input type="text" id="mpEditAddressDetail" class="mp-input" placeholder="상세주소" style="margin-top:8px;">
                    </div>
                    <div class="mp-btn-group">
                        <button type="button" onclick="closeMpSubModal('mpEditModal')" class="mp-btn-secondary">취소</button>
                        <button type="submit" class="mp-btn-primary">저장</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- 닉네임 변경 서브모달 -->
    <div id="mpNicknameModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpNicknameModal')"></div>
        <div class="mp-submodal-content">
            <div class="mp-submodal-header">
                <h3>닉네임 변경</h3>
                <button onclick="closeMpSubModal('mpNicknameModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <div id="mpNicknameStatus" class="mp-info-box"></div>
                <form id="mpNicknameForm" onsubmit="mpChangeNickname(event)">
                    <div class="mp-form-group">
                        <label>새 닉네임</label>
                        <div class="mp-input-row">
                            <input type="text" id="mpNewNickname" class="mp-input" placeholder="2~20자" required>
                            <button type="button" onclick="mpCheckNickname()" class="mp-btn-sm">중복확인</button>
                        </div>
                        <p id="mpNicknameError" class="mp-error hidden"></p>
                        <p id="mpNicknameSuccess" class="mp-success hidden"></p>
                    </div>
                    <div class="mp-btn-group">
                        <button type="button" onclick="closeMpSubModal('mpNicknameModal')" class="mp-btn-secondary">취소</button>
                        <button type="submit" id="mpNicknameSubmitBtn" class="mp-btn-primary" disabled>변경</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- 이메일 변경 서브모달 -->
    <div id="mpEmailModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpEmailModal')"></div>
        <div class="mp-submodal-content">
            <div class="mp-submodal-header">
                <h3>이메일 변경</h3>
                <button onclick="closeMpSubModal('mpEmailModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <div id="mpEmailStep1">
                    <p class="mp-desc">새 이메일 주소로 인증 코드가 발송됩니다.</p>
                    <div class="mp-form-group">
                        <label>현재 이메일</label>
                        <input type="email" id="mpCurrentEmail" class="mp-input" readonly style="background:#f3f4f6;">
                    </div>
                    <div class="mp-form-group">
                        <label>새 이메일</label>
                        <input type="email" id="mpNewEmailInput" class="mp-input" placeholder="새 이메일 주소" required>
                        <p id="mpEmailRequestError" class="mp-error hidden"></p>
                    </div>
                    <div class="mp-btn-group">
                        <button type="button" onclick="closeMpSubModal('mpEmailModal')" class="mp-btn-secondary">취소</button>
                        <button type="button" onclick="mpRequestEmailCode()" class="mp-btn-primary">인증 코드 발송</button>
                    </div>
                </div>
                <div id="mpEmailStep2" class="hidden">
                    <div class="mp-info-box mp-info-blue">
                        <p>📧 <strong id="mpSentEmailDisplay"></strong>으로 인증 코드를 발송했습니다.</p>
                        <p class="mp-hint">10분 내로 입력해주세요.</p>
                    </div>
                    <div class="mp-form-group">
                        <label>인증 코드 (6자리)</label>
                        <input type="text" id="mpEmailVerifyCode" class="mp-input mp-code-input" placeholder="000000" maxlength="6">
                        <p id="mpEmailVerifyError" class="mp-error hidden"></p>
                    </div>
                    <div class="mp-btn-group">
                        <button type="button" onclick="mpBackToEmailStep1()" class="mp-btn-secondary">뒤로</button>
                        <button type="button" onclick="mpVerifyEmailCode()" class="mp-btn-primary">확인</button>
                    </div>
                    <button type="button" onclick="mpRequestEmailCode()" class="mp-link-btn">인증 코드 재발송</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 비밀번호 변경 서브모달 -->
    <div id="mpPasswordModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpPasswordModal')"></div>
        <div class="mp-submodal-content">
            <div class="mp-submodal-header">
                <h3>비밀번호 변경</h3>
                <button onclick="closeMpSubModal('mpPasswordModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <form id="mpPasswordForm" onsubmit="mpChangePassword(event)">
                    <div class="mp-form-group">
                        <label>현재 비밀번호</label>
                        <input type="password" id="mpCurrentPassword" class="mp-input" required>
                    </div>
                    <div class="mp-form-group">
                        <label>새 비밀번호</label>
                        <input type="password" id="mpNewPassword" class="mp-input" placeholder="8자 이상" required>
                    </div>
                    <div class="mp-form-group">
                        <label>새 비밀번호 확인</label>
                        <input type="password" id="mpNewPasswordConfirm" class="mp-input" required>
                    </div>
                    <p id="mpPasswordError" class="mp-error hidden"></p>
                    <div class="mp-btn-group">
                        <button type="button" onclick="closeMpSubModal('mpPasswordModal')" class="mp-btn-secondary">취소</button>
                        <button type="submit" class="mp-btn-primary">변경</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- 회원 탈퇴 서브모달 -->
    <div id="mpWithdrawModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpWithdrawModal')"></div>
        <div class="mp-submodal-content">
            <div class="mp-submodal-header">
                <h3 style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> 회원 탈퇴</h3>
                <button onclick="closeMpSubModal('mpWithdrawModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <div class="mp-warning-box">
                    <p><strong>탈퇴 전 확인사항</strong></p>
                    <ul>
                        <li>혁신 당원인 경우 당비 납부가 자동 해지됩니다</li>
                        <li>후원/구매 내역은 법적 보관 기간 동안 유지됩니다</li>
                        <li>탈퇴 후에도 재가입이 가능합니다</li>
                    </ul>
                </div>
                <form id="mpWithdrawForm" onsubmit="mpWithdraw(event)">
                    <div class="mp-form-group">
                        <label>탈퇴 사유 (선택)</label>
                        <textarea id="mpWithdrawReason" class="mp-input" rows="3" placeholder="탈퇴 사유를 입력해주세요"></textarea>
                    </div>
                    <div class="mp-form-group">
                        <label>비밀번호 확인</label>
                        <input type="password" id="mpWithdrawPassword" class="mp-input" placeholder="본인 확인을 위해 비밀번호 입력" required>
                    </div>
                    <div class="mp-btn-group">
                        <button type="button" onclick="closeMpSubModal('mpWithdrawModal')" class="mp-btn-secondary">취소</button>
                        <button type="submit" class="mp-btn-danger">탈퇴하기</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- 프로필 이미지 서브모달 -->
    <div id="mpProfileImageModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpProfileImageModal')"></div>
        <div class="mp-submodal-content" style="max-width:500px;">
            <div class="mp-submodal-header">
                <h3>프로필 이미지 변경</h3>
                <button onclick="closeMpSubModal('mpProfileImageModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body">
                <div class="mp-profile-upload">
                    <div class="mp-current-avatar" id="mpCurrentAvatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="mp-upload-area" onclick="document.getElementById('mpProfileInput').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>이미지를 클릭하여 업로드</p>
                        <span class="mp-hint">JPG, PNG, GIF (최대 30MB)</span>
                        <input type="file" id="mpProfileInput" accept="image/*" class="hidden" onchange="mpHandleProfileSelect(this)">
                    </div>
                </div>
                <div id="mpUploadProgress" class="mp-progress hidden">
                    <i class="fas fa-spinner fa-spin"></i> 업로드 중...
                </div>
                <div class="mp-btn-group">
                    <button type="button" onclick="closeMpSubModal('mpProfileImageModal')" class="mp-btn-secondary">닫기</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 성공 모달 -->
    <div id="mpSuccessModal" class="mp-submodal">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpSuccessModal')"></div>
        <div class="mp-submodal-content" style="max-width:350px;text-align:center;">
            <div class="mp-submodal-body" style="padding:40px 30px;">
                <div class="mp-success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <p id="mpSuccessMessage" style="font-size:1rem;color:#333;margin:20px 0;"></p>
                <button onclick="closeMpSubModal('mpSuccessModal')" class="mp-btn-primary" style="width:100%;">확인</button>
            </div>
        </div>
    </div>
    
    <!-- 주소검색 모달 -->
    <div id="mpAddressModal" class="mp-submodal" style="z-index:10001;">
        <div class="mp-submodal-overlay" onclick="closeMpSubModal('mpAddressModal')"></div>
        <div class="mp-submodal-content" style="max-width:500px;">
            <div class="mp-submodal-header">
                <h3>주소 검색</h3>
                <button onclick="closeMpSubModal('mpAddressModal')" class="mp-close-btn">&times;</button>
            </div>
            <div class="mp-submodal-body" style="padding:0;">
                <div id="mpAddressSearchWrap" style="width:100%;height:400px;"></div>
            </div>
        </div>
    </div>
    `;
    
    const styleHTML = `
    <style id="mypageModalStyles">
        .mp-modal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 9998;
            padding: 20px;
            overflow-y: auto;
        }
        .mp-modal.active { display: flex; align-items: flex-start; justify-content: center; }
        .mp-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
        }
        .mp-modal-container {
            position: relative;
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3);
        }
        .mp-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 28px;
            border-bottom: 1px solid #e5e7eb;
        }
        .mp-modal-header h2 { font-size: 1.375rem; font-weight: 700; color: #111; margin: 0; }
        .mp-close-btn {
            width: 36px; height: 36px; border: none; background: #f3f4f6;
            border-radius: 50%; font-size: 22px; cursor: pointer;
            display: flex; align-items: center; justify-content: center; color: #666;
            transition: all 0.2s;
        }
        .mp-close-btn:hover { background: #e5e7eb; color: #333; }
        .mp-modal-body { padding: 28px; max-height: calc(100vh - 140px); overflow-y: auto; }
        .mp-loading { text-align: center; padding: 60px; color: #6b7280; }
        .mp-loading i { font-size: 2.5rem; margin-bottom: 12px; display: block; color: #A50034; }
        
        /* 섹션 카드 */
        .mp-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #f0f0f0;
        }
        .mp-section:last-child { margin-bottom: 0; }
        .mp-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .mp-section-title {
            font-size: 1rem;
            font-weight: 600;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .mp-section-title i { color: #A50034; }
        .mp-edit-link {
            color: #A50034;
            font-size: 0.875rem;
            cursor: pointer;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .mp-edit-link:hover { text-decoration: underline; }
        
        /* 프로필 카드 */
        .mp-profile-card {
            background: linear-gradient(135deg, #A50034 0%, #c41e3a 100%);
            color: white;
            border-radius: 12px;
            padding: 0;
            display: flex;
            align-items: stretch;
            gap: 0;
            overflow: hidden;
        }
        .mp-avatar {
            width: 140px; height: 140px;
            background: rgba(255,255,255,0.15);
            border-radius: 0;
            display: flex; align-items: center; justify-content: center;
            font-size: 3rem;
            overflow: hidden;
            flex-shrink: 0;
            cursor: pointer;
            position: relative;
            transition: all 0.2s;
        }
        .mp-avatar:hover { background: rgba(255,255,255,0.25); }
        .mp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mp-avatar-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.4);
            border-radius: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .mp-avatar:hover .mp-avatar-overlay { opacity: 1; }
        .mp-profile-info { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            padding: 24px;
        }
        .mp-profile-info h3 { font-size: 1.25rem; font-weight: 700; margin: 0 0 6px 0; }
        .mp-profile-info p { opacity: 0.85; font-size: 0.9rem; margin: 0; }
        .mp-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-left: 10px;
            vertical-align: middle;
        }
        .mp-badge.general { background: rgba(255,255,255,0.2); color: white; }
        .mp-badge.member { background: #dbeafe; color: #1d4ed8; }
        .mp-badge.innovation { background: #fef3c7; color: #b45309; }
        
        /* 정보 행 */
        .mp-info-row {
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .mp-info-row:last-child { border-bottom: none; }
        .mp-info-label { width: 100px; color: #6b7280; font-size: 0.875rem; flex-shrink: 0; }
        .mp-info-value { flex: 1; color: #1f2937; font-size: 0.875rem; }
        .mp-info-value button {
            margin-left: 8px;
            color: #A50034;
            background: none;
            border: none;
            font-size: 0.75rem;
            cursor: pointer;
        }
        .mp-info-value button:hover { text-decoration: underline; }
        
        /* 통계 */
        .mp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .mp-stat-card {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        .mp-stat-label { font-size: 0.8rem; color: #6b7280; margin-bottom: 6px; }
        .mp-stat-value { font-size: 1.25rem; font-weight: 700; color: #111; }
        
        /* 버튼 그룹 */
        .mp-btn-wrap { display: flex; flex-wrap: wrap; gap: 10px; }
        .mp-btn {
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .mp-btn-primary { background: #A50034; color: white; }
        .mp-btn-primary:hover { background: #8B002C; }
        .mp-btn-secondary { background: #f3f4f6; color: #374151; }
        .mp-btn-secondary:hover { background: #e5e7eb; }
        .mp-btn-outline { background: transparent; color: #dc2626; }
        .mp-btn-outline:hover { background: #fef2f2; }
        
        /* 서브모달 */
        .mp-submodal {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 10000;
            padding: 20px;
            overflow-y: auto;
            align-items: flex-start;
            justify-content: center;
        }
        .mp-submodal.active { display: flex; }
        .mp-submodal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
        }
        .mp-submodal-content {
            position: relative;
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 420px;
            margin: 60px auto;
            box-shadow: 0 25px 80px rgba(0,0,0,0.35);
        }
        .mp-submodal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 18px 24px;
            border-bottom: 1px solid #e5e7eb;
        }
        .mp-submodal-header h3 { font-size: 1.125rem; font-weight: 700; color: #111; margin: 0; }
        .mp-submodal-body { padding: 24px; }
        
        /* 폼 요소 */
        .mp-form-group { margin-bottom: 18px; }
        .mp-form-group label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 6px; }
        .mp-hint { font-size: 0.75rem; color: #9ca3af; font-weight: 400; }
        .mp-input {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 0.875rem;
            transition: all 0.2s;
        }
        .mp-input:focus { outline: none; border-color: #A50034; box-shadow: 0 0 0 3px rgba(165,0,52,0.1); }
        .mp-input-row { display: flex; gap: 8px; }
        .mp-input-row .mp-input { flex: 1; }
        .mp-btn-sm {
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            background: #f3f4f6;
            color: #374151;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .mp-btn-sm:hover { background: #e5e7eb; }
        .mp-btn-group { display: flex; gap: 10px; margin-top: 24px; }
        .mp-btn-group button { flex: 1; padding: 12px; border-radius: 8px; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; }
        .mp-btn-group .mp-btn-secondary { background: #f3f4f6; color: #374151; }
        .mp-btn-group .mp-btn-secondary:hover { background: #e5e7eb; }
        .mp-btn-group .mp-btn-primary { background: #A50034; color: white; }
        .mp-btn-group .mp-btn-primary:hover { background: #8B002C; }
        .mp-btn-group .mp-btn-danger { background: #dc2626; color: white; }
        .mp-btn-group .mp-btn-danger:hover { background: #b91c1c; }
        .mp-error { color: #dc2626; font-size: 0.8rem; margin-top: 6px; }
        .mp-success { color: #059669; font-size: 0.8rem; margin-top: 6px; }
        
        /* 정보 박스 */
        .mp-info-box { background: #eff6ff; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 0.875rem; color: #1e40af; }
        .mp-info-blue { background: #eff6ff; color: #1e40af; }
        .mp-warning-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px; margin-bottom: 18px; font-size: 0.8rem; color: #991b1b; }
        .mp-warning-box ul { margin: 8px 0 0 0; padding-left: 18px; }
        .mp-warning-box li { margin-bottom: 4px; }
        .mp-desc { font-size: 0.875rem; color: #6b7280; margin-bottom: 18px; }
        .mp-code-input { text-align: center; font-size: 1.5rem; letter-spacing: 0.5em; font-weight: 600; }
        .mp-link-btn { width: 100%; margin-top: 12px; background: none; border: none; color: #6b7280; font-size: 0.8rem; cursor: pointer; }
        .mp-link-btn:hover { color: #A50034; }
        
        /* 프로필 업로드 */
        .mp-profile-upload { display: flex; gap: 24px; align-items: center; margin-bottom: 20px; }
        .mp-current-avatar {
            width: 100px; height: 100px;
            background: #f3f4f6;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem; color: #9ca3af;
            overflow: hidden;
            flex-shrink: 0;
        }
        .mp-current-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mp-upload-area {
            flex: 1;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .mp-upload-area:hover { border-color: #A50034; background: rgba(165,0,52,0.03); }
        .mp-upload-area i { font-size: 2rem; color: #9ca3af; margin-bottom: 8px; }
        .mp-upload-area p { font-size: 0.875rem; color: #374151; margin: 0; }
        .mp-progress { text-align: center; padding: 16px; color: #A50034; }
        
        /* 성공 아이콘 */
        .mp-success-icon {
            width: 70px; height: 70px;
            background: #10b981;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto;
        }
        .mp-success-icon i { color: white; font-size: 32px; }
        
        /* 당원 정보 */
        .mp-party-info { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 16px; }
        .mp-party-header { display: flex; align-items: center; gap: 8px; color: #059669; font-weight: 600; margin-bottom: 12px; }
        .mp-party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mp-party-item span:first-child { display: block; font-size: 0.75rem; color: #6b7280; }
        .mp-party-item span:last-child { font-size: 0.875rem; font-weight: 500; color: #1f2937; }
        .mp-general-box { background: #f9fafb; border-radius: 10px; padding: 20px; text-align: center; }
        .mp-general-box p { color: #6b7280; margin-bottom: 12px; }
        .mp-general-box a {
            display: inline-block;
            background: #A50034;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.875rem;
        }
        .mp-general-box a:hover { background: #8B002C; }
    </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styleHTML);
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeMpSubModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showMpSuccess(message) {
    document.getElementById('mpSuccessMessage').textContent = message;
    document.getElementById('mpSuccessModal').classList.add('active');
}

// ===== 마이페이지 데이터 로드 =====
async function loadMypageInfo() {
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    const body = document.getElementById('mypageModalBody');
    
    try {
        const response = await fetch(API_BASE + '/members/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                closeMypageModal();
                localStorage.removeItem('memberToken');
                localStorage.removeItem('memberInfo');
                alert('로그인이 필요합니다.');
                return;
            }
            throw new Error('정보 조회 실패');
        }
        
        const result = await response.json();
        mypageMemberData = result.data;
        renderMypageContent();
        
    } catch (error) {
        console.error('마이페이지 로드 오류:', error);
        body.innerHTML = '<div class="mp-loading"><p>정보를 불러올 수 없습니다.</p></div>';
    }
}

function renderMypageContent() {
    const data = mypageMemberData;
    const body = document.getElementById('mypageModalBody');
    
    const memberTypeText = { 'general': '일반회원', 'party_member': '당원', 'innovation_member': '혁신당원' };
    const memberTypeClass = { 'general': 'general', 'party_member': 'member', 'innovation_member': 'innovation' };
    
    const avatarHtml = data.profileImage 
        ? '<img src="' + data.profileImage + '" alt="프로필">' 
        : '<i class="fas fa-user"></i>';
    
    const badgeClass = memberTypeClass[data.memberType] || 'general';
    const badgeText = memberTypeText[data.memberType] || '일반회원';
    
    // 당원 정보 섹션
    let partyInfoHtml = '';
    if (data.memberType === 'general') {
        partyInfoHtml = '<div class="mp-general-box"><p>아직 혁신 당원이 아니십니다</p><a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank"><i class="fas fa-user-plus"></i> 당원 가입하기</a></div>';
    } else {
        partyInfoHtml = '<div class="mp-party-info"><div class="mp-party-header"><i class="fas fa-check-circle"></i> 혁신 당원 (당비 납부 중)</div><div class="mp-party-grid"><div class="mp-party-item"><span>납부 시작일</span><span>' + (data.partyFeeStartDate || '-') + '</span></div><div class="mp-party-item"><span>월 납부액</span><span>' + (data.partyFeeMonthly || '-') + '</span></div><div class="mp-party-item"><span>총 납부 금액</span><span>' + (data.partyFeeTotalPaid || '-') + '</span></div><div class="mp-party-item"><span>최근 납부일</span><span>' + (data.partyFeeLastPayment || '-') + '</span></div></div></div>';
    }
    
    body.innerHTML = 
        '<div class="mp-section" style="padding:0;border:none;box-shadow:none;">' +
            '<div class="mp-profile-card">' +
                '<div class="mp-avatar" onclick="openMpProfileModal()">' + avatarHtml + '<div class="mp-avatar-overlay"><i class="fas fa-camera"></i></div></div>' +
                '<div class="mp-profile-info">' +
                    '<h3>' + (data.nickname || '닉네임 없음') + '<span class="mp-badge ' + badgeClass + '">' + badgeText + '</span></h3>' +
                    '<p>' + data.userId + '</p>' +
                '</div>' +
            '</div>' +
        '</div>' +
        
        '<div class="mp-section">' +
            '<div class="mp-section-header">' +
                '<div class="mp-section-title"><i class="fas fa-user"></i> 기본 정보</div>' +
                '<button class="mp-edit-link" onclick="openMpEditModal()"><i class="fas fa-edit"></i> 수정</button>' +
            '</div>' +
            '<div class="mp-info-row"><span class="mp-info-label">아이디</span><span class="mp-info-value">' + data.userId + '</span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">비밀번호</span><span class="mp-info-value">••••••••<button onclick="openMpPasswordModal()">변경</button></span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">닉네임</span><span class="mp-info-value">' + (data.nickname || '-') + '<button onclick="openMpNicknameModal()">변경</button></span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">이름</span><span class="mp-info-value">' + (data.name || '-') + '</span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">이메일</span><span class="mp-info-value">' + (data.email || '-') + '</span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">연락처</span><span class="mp-info-value">' + (data.phone || '-') + '</span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">도로명 주소</span><span class="mp-info-value">' + (data.address || '-') + '</span></div>' +
            '<div class="mp-info-row"><span class="mp-info-label">행정동 주소</span><span class="mp-info-value">' + (data.addressDong || '-') + '</span></div>' +
        '</div>' +
        
        '<div class="mp-section">' +
            '<div class="mp-section-title"><i class="fas fa-id-card"></i> 당원 정보</div>' +
            partyInfoHtml +
        '</div>' +
        
        '<div class="mp-section">' +
            '<div class="mp-section-title"><i class="fas fa-heart"></i> 후원/구매 내역</div>' +
            '<div class="mp-stats">' +
                '<div class="mp-stat-card"><div class="mp-stat-label">총 후원금</div><div class="mp-stat-value">' + (data.totalDonation || 0).toLocaleString() + '원</div></div>' +
                '<div class="mp-stat-card"><div class="mp-stat-label">총 구매금</div><div class="mp-stat-value">' + (data.totalPurchase || 0).toLocaleString() + '원</div></div>' +
            '</div>' +
        '</div>' +
        
        '<div class="mp-section">' +
            '<div class="mp-section-title"><i class="fas fa-exclamation-triangle"></i> 아주 위험한 구역</div>' +
            '<div class="mp-btn-wrap">' +
                '<button onclick="openMpWithdrawModal()" class="mp-btn mp-btn-outline"><i class="fas fa-person-running"></i> 회원 탈퇴</button>' +
            '</div>' +
        '</div>';
}

// ===== 기본 정보 수정 =====
function openMpEditModal() {
    const data = mypageMemberData;
    document.getElementById('mpEditName').value = data.name || '';
    document.getElementById('mpEditEmail').value = data.email || '';
    document.getElementById('mpEditPhone').value = data.phone || '';
    document.getElementById('mpEditZipCode').value = data.zipCode || '';
    document.getElementById('mpEditAddress').value = data.address || '';
    document.getElementById('mpEditAddressDong').value = data.addressDong || '';
    document.getElementById('mpEditAddressDetail').value = data.addressDetail || '';
    document.getElementById('mpEditModal').classList.add('active');
}

async function mpSaveInfo(event) {
    event.preventDefault();
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    try {
        const response = await fetch(API_BASE + '/members/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                phone: document.getElementById('mpEditPhone').value,
                zipCode: document.getElementById('mpEditZipCode').value,
                address: document.getElementById('mpEditAddress').value,
                addressDong: document.getElementById('mpEditAddressDong').value,
                addressDetail: document.getElementById('mpEditAddressDetail').value
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeMpSubModal('mpEditModal');
            showMpSuccess('정보가 수정되었습니다');
            loadMypageInfo();
        } else {
            alert(result.message || '수정에 실패했습니다');
        }
    } catch (error) {
        console.error('정보 수정 오류:', error);
        alert('수정 중 오류가 발생했습니다');
    }
}

function mpSearchAddress() {
    document.getElementById('mpAddressModal').classList.add('active');
    new daum.Postcode({
        oncomplete: function(data) {
            document.getElementById('mpEditZipCode').value = data.zonecode;
            document.getElementById('mpEditAddress').value = data.roadAddress;
            
            let dongAddress = '';
            if (data.sido) dongAddress += data.sido;
            if (data.sigungu) dongAddress += ' ' + data.sigungu;
            if (data.bname) dongAddress += ' ' + data.bname;
            document.getElementById('mpEditAddressDong').value = dongAddress;
            
            closeMpSubModal('mpAddressModal');
            document.getElementById('mpEditAddressDetail').focus();
        },
        width: '100%',
        height: '100%'
    }).embed(document.getElementById('mpAddressSearchWrap'));
}

// ===== 닉네임 변경 =====
async function openMpNicknameModal() {
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    try {
        const response = await fetch(API_BASE + '/members/me/nickname-status', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await response.json();
        
        const statusEl = document.getElementById('mpNicknameStatus');
        if (result.data.canChange) {
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> 닉네임 변경이 가능합니다';
            statusEl.style.background = '#ecfdf5';
            statusEl.style.color = '#059669';
        } else {
            const nextDate = new Date(result.data.nextChangeDate).toLocaleDateString('ko-KR');
            statusEl.innerHTML = '<i class="fas fa-clock"></i> ' + nextDate + ' 이후 변경 가능합니다';
            statusEl.style.background = '#fef3c7';
            statusEl.style.color = '#b45309';
        }
    } catch (error) {
        console.error('닉네임 상태 확인 오류:', error);
    }
    
    document.getElementById('mpNewNickname').value = '';
    document.getElementById('mpNicknameError').classList.add('hidden');
    document.getElementById('mpNicknameSuccess').classList.add('hidden');
    document.getElementById('mpNicknameSubmitBtn').disabled = true;
    mypageNicknameChecked = false;
    document.getElementById('mpNicknameModal').classList.add('active');
}

async function mpCheckNickname() {
    const nickname = document.getElementById('mpNewNickname').value.trim();
    const errorEl = document.getElementById('mpNicknameError');
    const successEl = document.getElementById('mpNicknameSuccess');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');
    
    if (nickname.length < 2 || nickname.length > 20) {
        errorEl.textContent = '닉네임은 2~20자여야 합니다';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/members/check-nickname?nickname=' + encodeURIComponent(nickname));
        const result = await response.json();
        
        if (result.available) {
            successEl.textContent = '사용 가능한 닉네임입니다';
            successEl.classList.remove('hidden');
            document.getElementById('mpNicknameSubmitBtn').disabled = false;
            mypageNicknameChecked = true;
        } else {
            errorEl.textContent = result.message || '이미 사용 중인 닉네임입니다';
            errorEl.classList.remove('hidden');
            document.getElementById('mpNicknameSubmitBtn').disabled = true;
        }
    } catch (error) {
        errorEl.textContent = '확인 중 오류가 발생했습니다';
        errorEl.classList.remove('hidden');
    }
}

async function mpChangeNickname(event) {
    event.preventDefault();
    if (!mypageNicknameChecked) {
        alert('닉네임 중복확인을 해주세요');
        return;
    }
    
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    const nickname = document.getElementById('mpNewNickname').value.trim();
    
    try {
        const response = await fetch(API_BASE + '/members/me/nickname', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ nickname })
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeMpSubModal('mpNicknameModal');
            showMpSuccess(result.message || '닉네임이 변경되었습니다');
            loadMypageInfo();
            // localStorage 업데이트
            const memberInfo = JSON.parse(localStorage.getItem('memberInfo') || '{}');
            memberInfo.nickname = nickname;
            localStorage.setItem('memberInfo', JSON.stringify(memberInfo));
            checkLoginStatus();
        } else {
            alert(result.message || '닉네임 변경에 실패했습니다');
        }
    } catch (error) {
        alert('변경 중 오류가 발생했습니다');
    }
}

// ===== 이메일 변경 =====
function openMpEmailModal() {
    document.getElementById('mpCurrentEmail').value = mypageMemberData.email || '';
    document.getElementById('mpNewEmailInput').value = '';
    document.getElementById('mpEmailRequestError').classList.add('hidden');
    document.getElementById('mpEmailStep1').classList.remove('hidden');
    document.getElementById('mpEmailStep2').classList.add('hidden');
    document.getElementById('mpEmailModal').classList.add('active');
}

async function mpRequestEmailCode() {
    const newEmail = document.getElementById('mpNewEmailInput').value.trim();
    const errorEl = document.getElementById('mpEmailRequestError');
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    errorEl.classList.add('hidden');
    
    if (!newEmail || !newEmail.includes('@')) {
        errorEl.textContent = '올바른 이메일 주소를 입력해주세요';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/members/me/email/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ newEmail })
        });
        
        const result = await response.json();
        
        if (result.success) {
            pendingNewEmail = newEmail;
            document.getElementById('mpSentEmailDisplay').textContent = newEmail;
            document.getElementById('mpEmailStep1').classList.add('hidden');
            document.getElementById('mpEmailStep2').classList.remove('hidden');
            document.getElementById('mpEmailVerifyCode').value = '';
            document.getElementById('mpEmailVerifyError').classList.add('hidden');
        } else {
            errorEl.textContent = result.message || '인증 코드 발송에 실패했습니다';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = '요청 중 오류가 발생했습니다';
        errorEl.classList.remove('hidden');
    }
}

function mpBackToEmailStep1() {
    document.getElementById('mpEmailStep1').classList.remove('hidden');
    document.getElementById('mpEmailStep2').classList.add('hidden');
}

async function mpVerifyEmailCode() {
    const code = document.getElementById('mpEmailVerifyCode').value.trim();
    const errorEl = document.getElementById('mpEmailVerifyError');
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    errorEl.classList.add('hidden');
    
    if (code.length !== 6) {
        errorEl.textContent = '6자리 인증 코드를 입력해주세요';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/members/me/email/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ newEmail: pendingNewEmail, code })
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeMpSubModal('mpEmailModal');
            closeMpSubModal('mpEditModal');
            showMpSuccess('이메일이 성공적으로 변경되었습니다!');
            loadMypageInfo();
        } else {
            errorEl.textContent = result.message || '인증에 실패했습니다';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = '인증 중 오류가 발생했습니다';
        errorEl.classList.remove('hidden');
    }
}

// ===== 비밀번호 변경 =====
function openMpPasswordModal() {
    document.getElementById('mpPasswordForm').reset();
    document.getElementById('mpPasswordError').classList.add('hidden');
    document.getElementById('mpPasswordModal').classList.add('active');
}

async function mpChangePassword(event) {
    event.preventDefault();
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    const errorEl = document.getElementById('mpPasswordError');
    
    const currentPassword = document.getElementById('mpCurrentPassword').value;
    const newPassword = document.getElementById('mpNewPassword').value;
    const newPasswordConfirm = document.getElementById('mpNewPasswordConfirm').value;
    
    errorEl.classList.add('hidden');
    
    if (newPassword.length < 8) {
        errorEl.textContent = '새 비밀번호는 8자 이상이어야 합니다';
        errorEl.classList.remove('hidden');
        return;
    }
    
    if (newPassword !== newPasswordConfirm) {
        errorEl.textContent = '새 비밀번호가 일치하지 않습니다';
        errorEl.classList.remove('hidden');
        return;
    }
    
    try {
        const response = await fetch(API_BASE + '/members/me/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeMpSubModal('mpPasswordModal');
            showMpSuccess('비밀번호가 변경되었습니다');
        } else {
            errorEl.textContent = result.message || '비밀번호 변경에 실패했습니다';
            errorEl.classList.remove('hidden');
        }
    } catch (error) {
        errorEl.textContent = '변경 중 오류가 발생했습니다';
        errorEl.classList.remove('hidden');
    }
}

// ===== 회원 탈퇴 =====
function openMpWithdrawModal() {
    document.getElementById('mpWithdrawForm').reset();
    document.getElementById('mpWithdrawModal').classList.add('active');
}

async function mpWithdraw(event) {
    event.preventDefault();
    
    if (!confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        return;
    }
    
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    
    try {
        const response = await fetch(API_BASE + '/members/me/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                reason: document.getElementById('mpWithdrawReason').value,
                password: document.getElementById('mpWithdrawPassword').value
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('탈퇴 처리가 완료되었습니다.\n\n그동안 자유와혁신과 함께해주셔서 감사합니다.');
            localStorage.removeItem('memberToken');
            localStorage.removeItem('memberInfo');
            window.location.href = '/';
        } else {
            alert(result.message || '탈퇴 처리에 실패했습니다');
        }
    } catch (error) {
        alert('탈퇴 처리 중 오류가 발생했습니다');
    }
}

// ===== 프로필 이미지 =====
function openMpProfileModal() {
    const avatar = document.getElementById('mpCurrentAvatar');
    if (mypageMemberData.profileImage) {
        avatar.innerHTML = '<img src="' + mypageMemberData.profileImage + '" alt="프로필">';
    } else {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    }
    document.getElementById('mpUploadProgress').classList.add('hidden');
    document.getElementById('mpProfileInput').value = '';
    document.getElementById('mpProfileImageModal').classList.add('active');
}

async function mpHandleProfileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다');
        return;
    }
    
    if (file.size > 30 * 1024 * 1024) {
        alert('이미지 크기는 30MB 이하만 가능합니다');
        return;
    }
    
    const token = localStorage.getItem('memberToken');
    const API_BASE = window.API_BASE || 'https://forthefreedom-kr-production.up.railway.app/api';
    const progressEl = document.getElementById('mpUploadProgress');
    
    progressEl.classList.remove('hidden');
    
    try {
        const formData = new FormData();
        formData.append('profileImage', file);
        
        const response = await fetch(API_BASE + '/members/me/profile-image', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeMpSubModal('mpProfileImageModal');
            showMpSuccess('프로필 이미지가 변경되었습니다!');
            loadMypageInfo();
        } else {
            alert(result.message || '이미지 업로드에 실패했습니다');
        }
    } catch (error) {
        alert('이미지 업로드 중 오류가 발생했습니다');
    } finally {
        progressEl.classList.add('hidden');
    }
}

// 전역 함수 등록
window.checkLoginStatus = checkLoginStatus;
window.navLogout = navLogout;
window.openMypageModal = openMypageModal;
window.closeMypageModal = closeMypageModal;
window.closeMpSubModal = closeMpSubModal;
window.openMpEditModal = openMpEditModal;
window.mpSaveInfo = mpSaveInfo;
window.mpSearchAddress = mpSearchAddress;
window.openMpNicknameModal = openMpNicknameModal;
window.mpCheckNickname = mpCheckNickname;
window.mpChangeNickname = mpChangeNickname;
window.openMpEmailModal = openMpEmailModal;
window.mpRequestEmailCode = mpRequestEmailCode;
window.mpBackToEmailStep1 = mpBackToEmailStep1;
window.mpVerifyEmailCode = mpVerifyEmailCode;
window.openMpPasswordModal = openMpPasswordModal;
window.mpChangePassword = mpChangePassword;
window.openMpWithdrawModal = openMpWithdrawModal;
window.mpWithdraw = mpWithdraw;
window.openMpProfileModal = openMpProfileModal;
window.mpHandleProfileSelect = mpHandleProfileSelect;

// 페이지 로드 시 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
});
