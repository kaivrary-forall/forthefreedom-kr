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
            <div class="side-banner-card" id="music-player-widget" style="margin-top: 10px;">
                <p style="font-size: 10px; color: #6b7280; margin-bottom: 8px;">
                    <i class="fas fa-music" style="margin-right: 4px;"></i>${isEnPage ? 'Party Song' : '당가'}
                </p>
                <div id="music-title" style="font-size: 11px; color: #374151; font-weight: 500; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${isEnPage ? 'Freedom & Innovation' : '자유와혁신 당가'}
                </div>
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <button onclick="musicPlayerPrev()" style="width: 28px; height: 28px; border: none; background: #f3f4f6; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-step-backward" style="font-size: 10px; color: #6b7280;"></i>
                    </button>
                    <button id="music-play-btn" onclick="musicPlayerToggle()" style="width: 36px; height: 36px; border: none; background: #a50034; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <i id="music-play-icon" class="fas fa-play" style="font-size: 12px; color: #fff; margin-left: 2px;"></i>
                    </button>
                    <button onclick="musicPlayerNext()" style="width: 28px; height: 28px; border: none; background: #f3f4f6; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-step-forward" style="font-size: 10px; color: #6b7280;"></i>
                    </button>
                </div>
                <div style="margin-top: 8px;">
                    <div style="width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden;">
                        <div id="music-progress" style="width: 0%; height: 100%; background: #a50034; border-radius: 2px; transition: width 0.3s;"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                        <span id="music-current-time" style="font-size: 9px; color: #9ca3af;">0:00</span>
                        <span id="music-duration" style="font-size: 9px; color: #9ca3af;">0:00</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 음악 플레이어 관련
    let musicAudio = null;
    let musicPlaylist = [
        { title: '자유와혁신 당가', titleEn: 'Freedom & Innovation', src: '/audio/party-song.mp3' }
    ];
    let currentTrackIndex = 0;

    function initMusicPlayer() {
        if (musicAudio) return;
        musicAudio = new Audio();
        musicAudio.volume = 0.7;
        
        musicAudio.addEventListener('timeupdate', updateMusicProgress);
        musicAudio.addEventListener('loadedmetadata', updateMusicDuration);
        musicAudio.addEventListener('ended', musicPlayerNext);
        
        loadTrack(currentTrackIndex);
    }

    function loadTrack(index) {
        if (!musicAudio) initMusicPlayer();
        currentTrackIndex = index;
        if (currentTrackIndex >= musicPlaylist.length) currentTrackIndex = 0;
        if (currentTrackIndex < 0) currentTrackIndex = musicPlaylist.length - 1;
        
        const track = musicPlaylist[currentTrackIndex];
        musicAudio.src = track.src;
        
        const titleEl = document.getElementById('music-title');
        if (titleEl) {
            titleEl.textContent = isEnPage ? track.titleEn : track.title;
        }
    }

    function updateMusicProgress() {
        if (!musicAudio) return;
        const progress = (musicAudio.currentTime / musicAudio.duration) * 100 || 0;
        const progressEl = document.getElementById('music-progress');
        const currentTimeEl = document.getElementById('music-current-time');
        
        if (progressEl) progressEl.style.width = progress + '%';
        if (currentTimeEl) currentTimeEl.textContent = formatTime(musicAudio.currentTime);
    }

    function updateMusicDuration() {
        if (!musicAudio) return;
        const durationEl = document.getElementById('music-duration');
        if (durationEl) durationEl.textContent = formatTime(musicAudio.duration);
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    window.musicPlayerToggle = function() {
        if (!musicAudio) initMusicPlayer();
        const icon = document.getElementById('music-play-icon');
        
        if (musicAudio.paused) {
            musicAudio.play().catch(e => console.log('Audio play failed:', e));
            if (icon) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                icon.style.marginLeft = '0';
            }
        } else {
            musicAudio.pause();
            if (icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                icon.style.marginLeft = '2px';
            }
        }
    };

    window.musicPlayerNext = function() {
        const wasPlaying = musicAudio && !musicAudio.paused;
        loadTrack(currentTrackIndex + 1);
        if (wasPlaying) {
            musicAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    window.musicPlayerPrev = function() {
        const wasPlaying = musicAudio && !musicAudio.paused;
        if (musicAudio && musicAudio.currentTime > 3) {
            musicAudio.currentTime = 0;
        } else {
            loadTrack(currentTrackIndex - 1);
        }
        if (wasPlaying) {
            musicAudio.play().catch(e => console.log('Audio play failed:', e));
        }
    };

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
