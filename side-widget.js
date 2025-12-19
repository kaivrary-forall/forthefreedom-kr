// 사이드 위젯 - 자유와혁신 일수 카운터 (애플 위젯 스타일)
(function() {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

    // 위젯 HTML 생성
    const widgetHTML = `
        <style>
            #side-widget-left {
                display: none;
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                z-index: 40;
                left: calc((100vw - 1280px) / 2 - 200px);
            }
            @media (min-width: 1600px) {
                #side-widget-left {
                    display: block;
                }
            }
            .widget-card {
                background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
            }
            .widget-number {
                background: linear-gradient(135deg, #a50034 0%, #c41e4a 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
        </style>
        <div id="side-widget-left">
            <div class="widget-card rounded-3xl shadow-xl border border-gray-200/50 p-6 w-44">
                <!-- 상단 라벨 -->
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-8 h-8 bg-gradient-to-br from-[#a50034] to-[#d4004a] rounded-lg flex items-center justify-center shadow-sm">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <span id="widget-label" class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                        ${isEnPage ? 'JOURNEY' : '발걸음'}
                    </span>
                </div>
                
                <!-- 일수 -->
                <div class="mb-2">
                    <span id="widget-day-number" class="widget-number text-5xl font-bold tracking-tight">-</span>
                </div>
                
                <!-- 하단 텍스트 -->
                <p id="widget-day-text" class="text-xs text-gray-400 font-medium">
                    ${isEnPage ? 'days with us' : '일째'}
                </p>
            </div>
        </div>
    `;

    // 위젯 삽입
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // 일수 계산 및 표시
    function updateDayCounter() {
        const numberEl = document.getElementById('widget-day-number');
        const labelEl = document.getElementById('widget-label');
        const textEl = document.getElementById('widget-day-text');
        if (!numberEl) return;

        // 회원 정보 확인
        const memberInfoStr = localStorage.getItem('memberInfo');
        
        if (memberInfoStr) {
            try {
                const memberInfo = JSON.parse(memberInfoStr);
                if (memberInfo.appliedAt) {
                    // 로그인 상태 - "자유와혁신과 함께한 지"
                    labelEl.textContent = isEnPage ? 'WITH US' : '함께한 지';
                    textEl.textContent = isEnPage ? 'days together' : '일째';
                    
                    const joinDate = new Date(memberInfo.appliedAt);
                    const joinDateKST = new Date(joinDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                    joinDateKST.setHours(0, 0, 0, 0);
                    
                    const today = new Date();
                    const todayKST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                    todayKST.setHours(0, 0, 0, 0);
                    
                    const diffTime = todayKST - joinDateKST;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    
                    numberEl.textContent = diffDays.toLocaleString();
                    return;
                }
            } catch (e) {}
        }
        
        // 비로그인 상태 - "자유와혁신의 발걸음"
        labelEl.textContent = isEnPage ? 'JOURNEY' : '발걸음';
        textEl.textContent = isEnPage ? 'days of journey' : '일째';
        
        const foundingDate = new Date('2025-01-26T00:00:00+09:00');
        const foundingDateKST = new Date(foundingDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        foundingDateKST.setHours(0, 0, 0, 0);
        
        const today = new Date();
        const todayKST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        todayKST.setHours(0, 0, 0, 0);
        
        const diffTime = todayKST - foundingDateKST;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            numberEl.textContent = 'D' + diffDays;
        } else {
            numberEl.textContent = (diffDays + 1).toLocaleString();
        }
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDayCounter);
    } else {
        updateDayCounter();
    }
})();
