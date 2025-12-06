// 관리자 공통 네비게이션
function loadAdminNav(currentPage) {
    const navContainer = document.getElementById('admin-nav-container');
    if (!navContainer) return;

    // 현재 페이지 체크
    const pages = {
        dashboard: currentPage === 'dashboard',
        content: currentPage === 'content',
        banners: currentPage === 'banners',
        members: currentPage === 'members'
    };

    // 관리자 정보 가져오기
    const adminInfo = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const adminName = adminInfo.name || adminInfo.username || '관리자';

    navContainer.innerHTML = `
    <nav class="nav-bar fixed top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- 왼쪽: 로고 + 메뉴 -->
                <div class="flex items-center space-x-8">
                    <a href="dashboard.html" class="flex items-center space-x-2">
                        <img src="../images/logo.png" alt="자유와혁신" class="h-8">
                        <span class="font-bold text-gray-900">관리자</span>
                    </a>
                    
                    <!-- 데스크톱 메뉴 -->
                    <div class="hidden md:flex items-center space-x-1">
                        <!-- 대시보드 -->
                        <a href="dashboard.html" class="px-3 py-2 text-sm font-medium rounded-md transition-colors ${pages.dashboard ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}">
                            <i class="fas fa-home mr-1"></i> 대시보드
                        </a>
                        
                        <!-- 콘텐츠 관리 드롭다운 -->
                        <div class="relative group">
                            <button class="px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${pages.content || pages.banners ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}">
                                <i class="fas fa-newspaper mr-1"></i> 콘텐츠 관리
                                <i class="fas fa-chevron-down ml-1 text-xs"></i>
                            </button>
                            <div class="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <a href="content.html" class="block px-4 py-2 text-sm ${pages.content ? 'text-primary bg-primary/5' : 'text-gray-700 hover:bg-gray-50'}">
                                    <i class="fas fa-list mr-2"></i> 콘텐츠 목록
                                </a>
                                <a href="banners.html" class="block px-4 py-2 text-sm ${pages.banners ? 'text-primary bg-primary/5' : 'text-gray-700 hover:bg-gray-50'}">
                                    <i class="fas fa-images mr-2"></i> 배너 관리
                                </a>
                            </div>
                        </div>
                        
                        <!-- 회원관리 -->
                        <a href="members.html" class="px-3 py-2 text-sm font-medium rounded-md transition-colors ${pages.members ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}">
                            <i class="fas fa-users mr-1"></i> 회원관리
                        </a>
                    </div>
                </div>

                <!-- 오른쪽: 세션 타이머 + 관리자 정보 + 로그아웃 -->
                <div class="flex items-center space-x-4">
                    <!-- 세션 타이머 -->
                    <div id="sessionTimer" class="hidden sm:flex items-center space-x-1 text-sm">
                        <i class="fas fa-clock text-gray-400"></i>
                        <span id="sessionCountdown" class="text-gray-500 font-mono">--:--</span>
                    </div>
                    
                    <div class="hidden sm:flex items-center space-x-2">
                        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-white text-sm"></i>
                        </div>
                        <span class="text-sm font-medium text-gray-700">${adminName}</span>
                    </div>
                    <button onclick="logout()" class="btn btn-secondary text-sm">
                        <i class="fas fa-sign-out-alt mr-1"></i> 로그아웃
                    </button>
                    
                    <!-- 모바일 메뉴 버튼 -->
                    <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
                        <i class="fas fa-bars text-lg"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 모바일 메뉴 -->
        <div id="mobileMenu" class="md:hidden hidden bg-white border-t border-gray-200">
            <div class="px-4 py-3 space-y-1">
                <a href="dashboard.html" class="block px-3 py-2 rounded-md text-sm font-medium ${pages.dashboard ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}">
                    <i class="fas fa-home mr-2"></i> 대시보드
                </a>
                <div class="border-t border-gray-100 my-2 pt-2">
                    <div class="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">콘텐츠 관리</div>
                    <a href="content.html" class="block px-3 py-2 rounded-md text-sm font-medium ${pages.content ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}">
                        <i class="fas fa-list mr-2"></i> 콘텐츠 목록
                    </a>
                    <a href="banners.html" class="block px-3 py-2 rounded-md text-sm font-medium ${pages.banners ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}">
                        <i class="fas fa-images mr-2"></i> 배너 관리
                    </a>
                </div>
                <div class="border-t border-gray-100 my-2 pt-2">
                    <a href="members.html" class="block px-3 py-2 rounded-md text-sm font-medium ${pages.members ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'}">
                        <i class="fas fa-users mr-2"></i> 회원관리
                    </a>
                </div>
            </div>
        </div>
    </nav>
    `;

    // 세션 타이머 시작
    initSessionTimer();
}

// 세션 타이머 초기화
function initSessionTimer() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    // JWT 토큰에서 만료 시간 추출
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expTime = payload.exp * 1000; // 초 → 밀리초
        
        // 1초마다 카운트다운 업데이트
        updateSessionCountdown(expTime);
        setInterval(() => updateSessionCountdown(expTime), 1000);
    } catch (e) {
        console.warn('토큰 파싱 실패:', e);
    }
}

// 세션 카운트다운 업데이트
function updateSessionCountdown(expTime) {
    const countdownEl = document.getElementById('sessionCountdown');
    if (!countdownEl) return;

    const now = Date.now();
    const remaining = expTime - now;

    if (remaining <= 0) {
        countdownEl.textContent = '만료됨';
        countdownEl.classList.remove('text-gray-500', 'text-yellow-600');
        countdownEl.classList.add('text-red-500');
        return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    // 5분 이하면 노란색, 1분 이하면 빨간색
    countdownEl.classList.remove('text-gray-500', 'text-yellow-600', 'text-red-500');
    if (minutes < 1) {
        countdownEl.classList.add('text-red-500');
    } else if (minutes < 5) {
        countdownEl.classList.add('text-yellow-600');
    } else {
        countdownEl.classList.add('text-gray-500');
    }

    countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// 로그아웃
async function logout() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        try {
            const token = localStorage.getItem('adminToken');
            const refreshToken = localStorage.getItem('adminRefreshToken');
            
            // 서버에 로그아웃 API 호출
            if (token && window.API_BASE) {
                await fetch(`${window.API_BASE}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ refreshToken })
                });
            }
        } catch (error) {
            console.log('서버 로그아웃 호출 실패 (무시):', error);
        }
        
        // 모든 토큰 정보 완전 삭제
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('authToken');
        
        // 세션 스토리지도 정리
        sessionStorage.clear();
        
        console.log('🚪 완전 로그아웃 완료');
        alert('로그아웃되었습니다.');
        
        // 로그인 페이지로 강제 이동
        window.location.href = 'index.html';
    }
}
