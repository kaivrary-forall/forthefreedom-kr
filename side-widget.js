// 사이드 배너 - 자유와혁신 일수 카운터 + 회원 정보
(function() {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
    const linkPrefix = isEnPage ? '../' : '';

    const bannerHTML = `
        <style>
            #side-banner-left, #side-banner-right {
                display: none;
                position: fixed;
                z-index: 40;
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
            .side-banner-card {
                background: white;
                border-radius: 16px;
                border: 1px solid #e5e7eb;
                padding: 14px;
                width: 140px;
                text-align: center;
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

    // 배너 위치 조정 - 1280px 컨텐츠 기준 고정 간격
    function adjustBannerPosition() {
        const nav = document.querySelector('nav') || document.querySelector('.nav-container') || document.querySelector('[class*="nav"]');
        const bannerLeft = document.getElementById('side-banner-left');
        const bannerRight = document.getElementById('side-banner-right');
        
        if (!bannerLeft || !bannerRight) return;
        
        const viewportWidth = window.innerWidth;
        const contentWidth = 1280;
        const bannerWidth = 140;
        const gap = 20;
        
        // 필요한 최소 너비: 1280 + (140 + 20) * 2 = 1600px
        const minWidth = contentWidth + (bannerWidth + gap) * 2;
        
        if (viewportWidth < minWidth) {
            // 공간 부족 - 배너 숨김
            bannerLeft.style.display = 'none';
            bannerRight.style.display = 'none';
            return;
        }
        
        // 배너 표시
        bannerLeft.style.display = 'block';
        bannerRight.style.display = 'block';
        
        // 상단 위치 (네비게이션 바 아래)
        if (nav) {
            const navBottom = nav.getBoundingClientRect().bottom;
            const topPos = (navBottom + 24) + 'px';
            bannerLeft.style.top = topPos;
            bannerRight.style.top = topPos;
        }
        
        // 좌우 위치 계산
        const sideMargin = (viewportWidth - contentWidth) / 2;
        const bannerPosition = sideMargin - bannerWidth - gap;
        
        bannerLeft.style.left = bannerPosition + 'px';
        bannerRight.style.right = bannerPosition + 'px';
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            adjustBannerPosition();
            updateCounter();
            updateMemberInfo();
        });
    } else {
        adjustBannerPosition();
        updateCounter();
        updateMemberInfo();
    }

    window.addEventListener('resize', adjustBannerPosition);
})();
