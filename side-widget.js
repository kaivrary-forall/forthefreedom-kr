// 사이드 배너 - 자유와혁신 일수 카운터
(function() {
    const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

    const bannerHTML = `
        <style>
            #side-banner {
                display: none;
                position: fixed;
                top: 140px;
                left: calc((100vw - 1280px) / 2 - 180px);
                z-index: 40;
            }
            @media (min-width: 1920px) {
                #side-banner {
                    display: block;
                }
            }
            .day-digit {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 36px;
                background: #a50034;
                color: white;
                font-size: 20px;
                font-weight: 700;
                border-radius: 4px;
                margin: 0 1px;
            }
        </style>
        <div id="side-banner">
            <div class="bg-white rounded-xl border border-gray-200 p-4 w-44">
                <p id="banner-label" class="text-xs text-gray-500 font-medium mb-2 text-center">
                    ${isEnPage ? "Our Journey" : '자유와혁신의 발걸음'}
                </p>
                <div id="banner-digits" class="flex justify-center items-center mb-1"></div>
                <p class="text-xs text-gray-400 text-center">${isEnPage ? 'days' : '일째'}</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

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

        const memberInfoStr = localStorage.getItem('memberInfo');
        
        if (memberInfoStr) {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateCounter);
    } else {
        updateCounter();
    }
})();
