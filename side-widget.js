/**
 * side-widget.js (CSS 기반 버전)
 * - 위치 계산 없음 (CSS calc()로 처리)
 * - CSS 변수만 업데이트 (nav, announcement 높이)
 * - 배너 내용 렌더링
 */
(function () {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
    const linkPrefix = isEnPage ? '../' : '';

    // CSS 변수 업데이트
    function updateCSSVariables() {
        const nav = document.querySelector('#navigation-container nav') || document.querySelector('nav');
        const announcement = document.getElementById('announcement-bar');
        
        const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 56;
        const annH = announcement ? Math.ceil(announcement.getBoundingClientRect().height) : 0;
        
        document.documentElement.style.setProperty('--nav-height', navH + 'px');
        document.documentElement.style.setProperty('--announcement-height', annH + 'px');
    }

    // 배너 컨테이너 생성
    function createBannerContainers() {
        // 이미 존재하면 스킵
        if (document.getElementById('side-banner-left')) return;
        
        const leftBanner = document.createElement('div');
        leftBanner.id = 'side-banner-left';
        leftBanner.className = 'side-banner';
        
        const rightBanner = document.createElement('div');
        rightBanner.id = 'side-banner-right';
        rightBanner.className = 'side-banner';
        
        document.body.appendChild(leftBanner);
        document.body.appendChild(rightBanner);
    }

    // 일수 카운터 렌더링
    function renderDayCounter(el) {
        if (!el) return;
        
        const token = localStorage.getItem('memberToken');
        const memberInfoStr = localStorage.getItem('memberInfo');
        
        let labelText = isEnPage ? "Our Journey" : '자유와혁신의 발걸음';
        let days = 0;
        
        if (token && memberInfoStr) {
            try {
                const memberInfo = JSON.parse(memberInfoStr);
                if (memberInfo.appliedAt) {
                    labelText = isEnPage ? 'Together with you' : '우리가 함께한 지';
                    const joinDate = new Date(memberInfo.appliedAt);
                    const today = new Date();
                    days = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24)) + 1;
                }
            } catch (e) {}
        }
        
        if (days === 0) {
            const foundingDate = new Date('2025-06-06T00:00:00+09:00');
            const today = new Date();
            days = Math.floor((today - foundingDate) / (1000 * 60 * 60 * 24)) + 1;
            days = Math.max(1, days);
        }
        
        const numStr = String(days).padStart(4, '0');
        let digitsHTML = '';
        for (let i = 0; i < numStr.length; i++) {
            digitsHTML += '<span class="day-digit">' + numStr[i] + '</span>';
        }
        
        el.innerHTML = `
            <div class="side-banner-card">
                <p style="font-size: 10px; color: #6b7280; margin-bottom: 8px;">${labelText}</p>
                <div style="display: flex; justify-content: center; gap: 2px; margin-bottom: 4px;">${digitsHTML}</div>
                <p style="font-size: 11px; color: #9ca3af;">${isEnPage ? 'days' : '일째'}</p>
            </div>
        `;
    }

    // 회원 정보 렌더링
    function renderMemberInfo(el) {
        if (!el) return;
        
        const token = localStorage.getItem('memberToken');
        const memberInfoStr = localStorage.getItem('memberInfo');
        let memberInfo = null;
        
        try {
            memberInfo = memberInfoStr ? JSON.parse(memberInfoStr) : null;
        } catch (e) {}
        
        const loggedIn = !!token && !!memberInfo && !!memberInfo.nickname;
        
        if (!loggedIn) {
            el.innerHTML = `
                <div class="side-banner-card">
                    <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <svg style="width: 28px; height: 28px; color: #9ca3af;" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <a href="${linkPrefix}login.html" class="member-btn member-btn-primary">${isEnPage ? 'Login' : '로그인'}</a>
                        <a href="${linkPrefix}join.html" class="member-btn member-btn-secondary">${isEnPage ? 'Sign Up' : '회원가입'}</a>
                    </div>
                </div>
            `;
            return;
        }
        
        const name = memberInfo.nickname || memberInfo.name || 'Member';
        const profileImage = memberInfo.profileImage;
        
        const avatarHTML = profileImage 
            ? `<img src="${profileImage}" style="width: 100%; height: 100%; object-fit: cover;" alt="profile">`
            : `<svg style="width: 28px; height: 28px; color: #9ca3af;" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
               </svg>`;
        
        el.innerHTML = `
            <div class="side-banner-card">
                <div style="width: 50px; height: 50px; margin: 0 auto 10px; border-radius: 50%; background: #f3f4f6; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${avatarHTML}
                </div>
                <p style="font-size: 12px; color: #374151; font-weight: 600; margin-bottom: 10px;">${name}</p>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <a href="${linkPrefix}mypage.html" class="member-btn member-btn-primary">${isEnPage ? 'My Page' : '마이페이지'}</a>
                    <button onclick="logoutMember()" class="member-btn member-btn-secondary">${isEnPage ? 'Logout' : '로그아웃'}</button>
                </div>
            </div>
        `;
    }

    window.logoutMember = function() {
        localStorage.removeItem('memberToken');
        localStorage.removeItem('memberInfo');
        location.reload();
    };

    // 초기화
    function init() {
        createBannerContainers();
        
        const left = document.getElementById('side-banner-left');
        const right = document.getElementById('side-banner-right');
        
        renderDayCounter(left);
        renderMemberInfo(right);
        updateCSSVariables();
        
        // 리사이즈 시 CSS 변수 업데이트
        window.addEventListener('resize', updateCSSVariables, { passive: true });
        
        // DOM 변화 감지 (nav/announcement 동적 로드 대응)
        const obs = new MutationObserver(() => updateCSSVariables());
        obs.observe(document.body, { childList: true, subtree: true });
        
        // 전역 노출 (nav.js에서 호출용)
        window.adjustBannerPosition = updateCSSVariables;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
