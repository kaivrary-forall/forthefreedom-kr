// 사이드 위젯 - 자유와혁신 일수 카운터
(function() {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

    // 위젯 HTML 생성
    const widgetHTML = `
        <style>
            #side-widget-left {
                display: none;
                position: fixed;
                top: 120px;
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
            .day-digit {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 40px;
                background: linear-gradient(135deg, #a50034 0%, #c41e4a 100%);
                color: white;
                font-size: 24px;
                font-weight: 700;
                border-radius: 6px;
                margin: 0 2px;
            }
        </style>
        <div id="side-widget-left">
            <div class="widget-card rounded-2xl shadow-xl border border-gray-200/50 p-5 w-48">
                <!-- 라벨 -->
                <p id="widget-label" class="text-xs text-gray-500 font-medium mb-3 text-center">
                    ${isEnPage ? "Freedom & Innovation's Journey" : '자유와혁신의 발걸음'}
                </p>
                
                <!-- 일수 디지털 디스플레이 -->
                <div id="widget-digits" class="flex justify-center items-center mb-2">
                    <!-- JS로 채움 -->
                </div>
                
                <!-- 일째 -->
                <p class="text-sm text-gray-400 font-medium text-center">${isEnPage ? 'days' : '일째'}</p>
            </div>
        </div>
    `;

    // 위젯 삽입
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // 숫자를 디지털 디스플레이로 변환
    function renderDigits(number) {
        const digitsContainer = document.getElementById('widget-digits');
        if (!digitsContainer) return;
        
        const numStr = String(number).padStart(4, '0');
        let html = '';
        for (let i = 0; i < numStr.length; i++) {
            html += `<span class="day-digit">${numStr[i]}</span>`;
        }
        digitsContainer.innerHTML = html;
    }

    // 일수 계산 및 표시
    function updateDayCounter() {
        const labelEl = document.getElementById('widget-label');
        if (!labelEl) return;

        // 회원 정보 확인
        const memberInfoStr = localStorage.getItem('memberInfo');
        
        if (memberInfoStr) {
            try {
                const memberInfo = JSON.parse(memberInfoStr);
                if (memberInfo.appliedAt) {
                    // 로그인 상태 - "우리가 함께한 지"
                    labelEl.textContent = isEnPage ? 'Together with you' : '우리가 함께한 지';
                    
                    const joinDate = new Date(memberInfo.appliedAt);
                    const joinDateKST = new Date(joinDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                    joinDateKST.setHours(0, 0, 0, 0);
                    
                    const today = new Date();
                    const todayKST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                    todayKST.setHours(0, 0, 0, 0);
                    
                    const diffTime = todayKST - joinDateKST;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    
                    renderDigits(diffDays);
                    return;
                }
            } catch (e) {}
        }
        
        // 비로그인 상태 - "자유와혁신의 발걸음" (2025년 6월 6일 기준)
        labelEl.textContent = isEnPage ? "Freedom & Innovation's Journey" : '자유와혁신의 발걸음';
        
        const foundingDate = new Date('2025-06-06T00:00:00+09:00');
        const foundingDateKST = new Date(foundingDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        foundingDateKST.setHours(0, 0, 0, 0);
        
        const today = new Date();
        const todayKST = new Date(today.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        todayKST.setHours(0, 0, 0, 0);
        
        const diffTime = todayKST - foundingDateKST;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        renderDigits(Math.max(1, diffDays));
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateDayCounter);
    } else {
        updateDayCounter();
    }
})();
