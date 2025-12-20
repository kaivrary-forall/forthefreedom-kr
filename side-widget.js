// 사이드 배너 - 자유와혁신 일수 카운터 + 회원 정보
(function() {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
    const linkPrefix = isEnPage ? '../' : '';

    // CSS 변수 기반 위치 계산 - 줌에 안정적
    const bannerHTML = `
        <style>
            :root {
                --content-width: 1280px;
                --banner-width: 140px;
                --banner-gap: 16px;
                --nav-height: 56px;
                --announcement-height: 0px;
            }
            
            #side-banner-left, #side-banner-right {
                position: fixed;
                z-index: 40;
                top: calc(var(--nav-height) + var(--announcement-height) + 24px);
                width: var(--banner-width);
            }
            
            /* 컨텐츠 중심 기준 배치 - calc 사용 */
            #side-banner-left {
                /* 화면 중앙에서 왼쪽으로: (컨텐츠폭/2 + gap + 배너폭) */
                left: calc(50% - var(--content-width)/2 - var(--banner-gap) - var(--banner-width));
            }
            
            #side-banner-right {
                /* 화면 중앙에서 오른쪽으로: (컨텐츠폭/2 + gap) */
                left: calc(50% + var(--content-width)/2 + var(--banner-gap));
            }
            
            .side-banner-card {
                background: white;
                border-radius: 16px;
                border: 1px solid #e5e7eb;
                padding: 14px;
                width: 100%;
                text-align: center;
            }
            
            .day-digit {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 32px;
                background: #a50034;
                color: white;
                font-size: 16px;
                font-weight: 700;
                border-radius: 5px;
            }
            
            .member-btn {
                display: block;
                width: 100%;
                padding: 7px 0;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.2s;
            }
            
            .member-btn-primary {
                background: #a50034;
                color: white;
            }
            
            .member-btn-primary:hover {
                background: #8a002c;
            }
            
            .member-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            
            .member-btn-secondary:hover {
                background: #e5e7eb;
            }
            
            /* 배너가 화면 밖으로 나가면 숨김 */
            /* 최소 필요 너비: 1280 + (140 + 16) * 2 = 1592px */
            @media (max-width: 1592px) {
                #side-banner-left, #side-banner-right {
                    display: none !important;
                }
            }
            
            @media (min-width: 1593px) {
                #side-banner-left, #side-banner-right {
                    display: block;
                }
            }
        </style>

        <!-- 왼쪽 배너: 일수 카운터 -->
        <div id="side-banner-left">
            <div class="side-banner-card">
                <p id="banner-label" style="font-size: 10px; color: #6b7280; margin-bottom: 8px;">
                    ${isEnPage ? "Our Journey" : '자유와혁신의 발걸음'}
                </p>
                <div id="banner-digits" style="display: flex; justify-content: center; gap: 2px; margin-bottom: 4px;"></div>
                <p style="font-size: 11px; color: #9ca3af;">${isEnPage ? 'days' : '일째'}</p>
            </div>
        </div>

        <!-- 오른쪽 배너: 회원 정보 -->
        <div id="side-banner-right">
            <div class="side-banner-card">
                <!-- 프로필 이미지 -->
                <div id="profile-image" style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <svg id="default-avatar" style="width: 28px; height: 28px; color: #9ca3af;" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <img id="member-avatar" style="width: 100%; height: 100%; object-fit: cover; display: none;" alt="profile">
                </div>
                
                <!-- 회원 아이디 (로그인 시에만) -->
                <p id="member-id" style="font-size: 12px; color: #374151; font-weight: 600; margin-bottom: 10px; display: none;"></p>
                
                <!-- 비로그인 상태 버튼 -->
                <div id="guest-buttons" style="display: flex; flex-direction: column; gap: 6px;">
                    <a href="${linkPrefix}login.html" class="member-btn member-btn-primary">${isEnPage ? 'Login' : '로그인'}</a>
                    <a href="${linkPrefix}join.html" class="member-btn member-btn-secondary">${isEnPage ? 'Sign Up' : '회원가입'}</a>
                </div>
                
                <!-- 로그인 상태 버튼 -->
                <div id="member-buttons" style="display: none; flex-direction: column; gap: 6px;">
                    <a href="${linkPrefix}mypage.html" class="member-btn member-btn-primary">${isEnPage ? 'My Page' : '마이페이지'}</a>
                    <button onclick="logoutMember()" class="member-btn member-btn-secondary">${isEnPage ? 'Logout' : '로그아웃'}</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    // CSS 변수 업데이트 함수 - nav/공지 높이 변경 시 호출
    function updateBannerPosition() {
        const nav = document.querySelector('nav');
        const announcement = document.getElementById('announcement-bar');
        
        const navHeight = nav ? nav.offsetHeight : 56;
        const announcementHeight = announcement ? announcement.offsetHeight : 0;
        
        document.documentElement.style.setProperty('--nav-height', navHeight + 'px');
        document.documentElement.style.setProperty('--announcement-height', announcementHeight + 'px');
    }

    function renderDigits(number) {
        const container = document.getElementById('banner-digits');
        if (!container) return;
        const numStr = String(number).padStart(4, '0');
        let html = '';
        for (let i = 0; i < numStr.length; i++) {
            html += '<span class="day-digit">' + numStr[i] + '</span>';
        }
        container.innerHTML = html;
    }

    function updateCounter() {
        const labelEl = document.getElementById('banner-label');
        if (!labelEl) return;

        const token = localStorage.getItem('memberToken');
        const memberInfoStr = localStorage.getItem('memberInfo');
        
        if (token && memberInfoStr) {
            try {
                const memberInfo = JSON.parse(memberInfoStr);
                if (memberInfo.appliedAt) {
                    labelEl.textContent = isEnPage ? 'Together with you' : '우리가 함께한 지';
                    const joinDate = new Date(memberInfo.appliedAt);
                    const today = new Date();
                    const diffDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24)) + 1;
                    renderDigits(diffDays);
                    return;
                }
            } catch (e) {}
        }
        
        labelEl.textContent = isEnPage ? "Our Journey" : '자유와혁신의 발걸음';
        const foundingDate = new Date('2025-06-06T00:00:00+09:00');
        const today = new Date();
        const diffDays = Math.floor((today - foundingDate) / (1000 * 60 * 60 * 24)) + 1;
        renderDigits(Math.max(1, diffDays));
    }

    function updateMemberInfo() {
        const token = localStorage.getItem('memberToken');
        const memberInfoStr = localStorage.getItem('memberInfo');
        const guestButtons = document.getElementById('guest-buttons');
        const memberButtons = document.getElementById('member-buttons');
        const memberId = document.getElementById('member-id');
        const defaultAvatar = document.getElementById('default-avatar');
        const memberAvatar = document.getElementById('member-avatar');

        if (token && memberInfoStr) {
            try {
                const memberInfo = JSON.parse(memberInfoStr);
                if (memberInfo.nickname) {
                    if (guestButtons) guestButtons.style.display = 'none';
                    if (memberButtons) memberButtons.style.display = 'flex';
                    if (memberId) {
                        memberId.style.display = 'block';
                        memberId.textContent = memberInfo.nickname || memberInfo.name || 'Member';
                    }
                    if (memberInfo.profileImage && memberAvatar && defaultAvatar) {
                        memberAvatar.src = memberInfo.profileImage;
                        memberAvatar.style.display = 'block';
                        defaultAvatar.style.display = 'none';
                    }
                    return;
                }
            } catch (e) {}
        }
        
        if (guestButtons) guestButtons.style.display = 'flex';
        if (memberButtons) memberButtons.style.display = 'none';
        if (memberId) memberId.style.display = 'none';
        if (defaultAvatar) defaultAvatar.style.display = 'block';
        if (memberAvatar) memberAvatar.style.display = 'none';
    }

    window.logoutMember = function() {
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberInfo');
        location.reload();
    };

    // 전역 노출 (nav.js에서 호출용) - 이제 CSS 변수만 업데이트
    window.adjustBannerPosition = updateBannerPosition;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateBannerPosition();
            updateCounter();
            updateMemberInfo();
        });
    } else {
        updateBannerPosition();
        updateCounter();
        updateMemberInfo();
    }

    // 리사이즈 시에도 CSS 변수 업데이트 (nav 높이 변경 대응)
    window.addEventListener('resize', updateBannerPosition);
})();
