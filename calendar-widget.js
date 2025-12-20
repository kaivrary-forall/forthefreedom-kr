// Google Calendar 연동 2주 캘린더 위젯
// 자유와혁신 forthefreedom.kr

const CalendarWidget = {
    // 설정
    config: {
        apiKey: 'AIzaSyA0sZB6XDRiv1oGiZsy5Sj6EfwAoTCwyLY',
        calendarId: 'c_247b26bfef68b603b79b35081977bd0c9a2980fb904a37569f28a7ba07e82c96@group.calendar.google.com',
        maxResults: 50
    },

    // 일정 데이터 저장
    events: [],

    // 초기화
    init: function() {
        this.render();
        this.fetchEvents();
    },

    // 이번 주 일요일 구하기
    getThisWeekSunday: function() {
        const today = new Date();
        const day = today.getDay(); // 0 = 일요일
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - day);
        sunday.setHours(0, 0, 0, 0);
        return sunday;
    },

    // 구글 캘린더 API에서 일정 가져오기
    fetchEvents: async function() {
        const sunday = this.getThisWeekSunday();
        const twoWeeksLater = new Date(sunday);
        twoWeeksLater.setDate(sunday.getDate() + 14);

        const timeMin = sunday.toISOString();
        const timeMax = twoWeeksLater.toISOString();

        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.config.calendarId)}/events?key=${this.config.apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=${this.config.maxResults}&singleEvents=true&orderBy=startTime`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                console.error('Google Calendar API 오류:', data.error);
                this.showError('일정을 불러올 수 없습니다.');
                return;
            }

            this.events = (data.items || []).map(event => {
                // 날짜 파싱 (한국 시간대 고려)
                let eventDate, eventTime;
                
                if (event.start.date) {
                    // 종일 일정
                    eventDate = event.start.date;
                    eventTime = '종일';
                } else if (event.start.dateTime) {
                    // 시간 지정 일정 - 한국 시간대로 변환
                    const dt = new Date(event.start.dateTime);
                    eventDate = dt.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
                    eventTime = dt.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false });
                }
                
                return {
                    id: event.id,
                    title: event.summary || '(제목 없음)',
                    date: eventDate,
                    time: eventTime,
                    location: event.location || '',
                    description: event.description || '',
                    url: event.description && event.description.startsWith('http') 
                        ? event.description.split('\n')[0] 
                        : (event.htmlLink || '#'),
                    color: this.getEventColor(event)
                };
            });

            this.renderCalendar();
            this.renderEventList();

        } catch (error) {
            console.error('캘린더 로딩 오류:', error);
            this.showError('일정을 불러올 수 없습니다.');
        }
    },

    // 이벤트 색상 결정 (구글 캘린더 colorId 기반)
    getEventColor: function(event) {
        const colors = {
            '1': '#7986cb', // 라벤더
            '2': '#33b679', // 세이지
            '3': '#8e24aa', // 포도
            '4': '#e67c73', // 플라밍고
            '5': '#f6bf26', // 바나나
            '6': '#f4511e', // 귤
            '7': '#039be5', // 피콕
            '8': '#616161', // 흑연
            '9': '#3f51b5', // 블루베리
            '10': '#0b8043', // 바질
            '11': '#d50000'  // 토마토
        };
        return colors[event.colorId] || '#a50034'; // 기본 자유와혁신 빨강
    },

    // 기본 구조 렌더링
    render: function() {
        const container = document.getElementById('calendar-widget');
        if (!container) return;

        // 언어 감지
        const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

        container.innerHTML = `
            <section class="py-12 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <!-- 섹션 헤더 -->
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">${isEnPage ? 'Freedom & Innovation Events' : '자유와혁신 주요 일정'}</h2>
                            <p class="text-gray-500 mt-1">${isEnPage ? 'Check out our upcoming schedule' : '다가오는 일정을 확인하세요'}</p>
                        </div>
                        <a href="${isEnPage ? '/en/news/events.html' : '/news/events.html'}" class="text-[#a50034] hover:text-[#8B002C] font-medium flex items-center gap-1">
                            ${isEnPage ? 'View All' : '전체 일정 보기'} <i class="fas fa-arrow-right text-sm"></i>
                        </a>
                    </div>

                    <!-- 캘린더 네비게이션 -->
                    <div class="flex items-center justify-between mb-6">
                        <button onclick="CalendarWidget.prevWeeks()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <i class="fas fa-chevron-left text-gray-600"></i>
                        </button>
                        <h3 id="calendar-title" class="text-lg font-semibold text-gray-800"></h3>
                        <button onclick="CalendarWidget.nextWeeks()" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <i class="fas fa-chevron-right text-gray-600"></i>
                        </button>
                    </div>

                    <!-- 캘린더 그리드 -->
                    <div class="bg-white rounded-lg overflow-hidden">
                        <!-- 요일 헤더 -->
                        <div class="grid grid-cols-7 border-b border-gray-200">
                            <div class="text-center text-xs sm:text-sm font-medium text-red-500 py-3 border-r border-gray-200">${isEnPage ? 'Sun' : '일'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-gray-600 py-3 border-r border-gray-200">${isEnPage ? 'Mon' : '월'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-gray-600 py-3 border-r border-gray-200">${isEnPage ? 'Tue' : '화'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-gray-600 py-3 border-r border-gray-200">${isEnPage ? 'Wed' : '수'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-gray-600 py-3 border-r border-gray-200">${isEnPage ? 'Thu' : '목'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-gray-600 py-3 border-r border-gray-200">${isEnPage ? 'Fri' : '금'}</div>
                            <div class="text-center text-xs sm:text-sm font-medium text-[#004A98] py-3">${isEnPage ? 'Sat' : '토'}</div>
                        </div>

                        <!-- 날짜 그리드 -->
                        <div id="calendar-grid" class="border-l border-gray-200">
                            <div class="text-center text-gray-400 py-8">${isEnPage ? 'Loading...' : '일정을 불러오는 중...'}</div>
                        </div>
                    </div>

                    <!-- 일정 리스트 -->
                    <div class="mt-8">
                        <h4 class="text-lg font-semibold text-gray-800 mb-4">${isEnPage ? 'Coming Up' : '다가오는 일정'}</h4>
                        <div id="event-list" class="space-y-3">
                            <div class="text-center text-gray-400 py-4">${isEnPage ? 'Loading...' : '일정을 불러오는 중...'}</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    // 현재 표시 시작점 (offset: 0 = 이번주, -14 = 2주 전, 14 = 2주 후)
    weekOffset: 0,

    // 이전 2주
    prevWeeks: function() {
        this.weekOffset -= 14;
        this.renderCalendar();
    },

    // 다음 2주
    nextWeeks: function() {
        this.weekOffset += 14;
        this.renderCalendar();
    },

    // 캘린더 그리드 렌더링
    renderCalendar: function() {
        const grid = document.getElementById('calendar-grid');
        const title = document.getElementById('calendar-title');
        if (!grid || !title) return;

        const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';
        
        // 시작일 계산 (이번 주 일요일 + offset)
        const startDate = this.getThisWeekSunday();
        startDate.setDate(startDate.getDate() + this.weekOffset);

        // 제목 설정
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 13);

        const startMonth = startDate.toLocaleDateString(isEnPage ? 'en-US' : 'ko-KR', { year: 'numeric', month: 'long' });
        const endMonth = endDate.toLocaleDateString(isEnPage ? 'en-US' : 'ko-KR', { year: 'numeric', month: 'long' });

        title.textContent = startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`;

        // 오늘 날짜
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 2주 렌더링 (각 주별로)
        let html = '';

        for (let week = 0; week < 2; week++) {
            html += '<div class="grid grid-cols-7">';

            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + (week * 7) + day);

                const dateStr = date.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
                const dayEvents = this.events.filter(e => e.date === dateStr);
                const isToday = date.getTime() === today.getTime();
                const isSunday = date.getDay() === 0;
                const isSaturday = date.getDay() === 6;

                // 날짜 셀 클래스 - 배경 없이 연한 회색 테두리로 구분
                let cellClass = 'p-2 sm:p-3 min-h-[80px] sm:min-h-[100px] border-b border-gray-200';
                if (!isSaturday) {
                    cellClass += ' border-r';
                }
                if (isToday) {
                    cellClass += ' bg-[#a50034] text-white';
                }

                // 날짜 숫자 클래스
                let numClass = 'text-base sm:text-lg font-semibold mb-1 sm:mb-2';
                if (isToday) {
                    numClass += ' text-white';
                } else if (isSunday) {
                    numClass += ' text-red-500';
                } else if (isSaturday) {
                    numClass += ' text-[#004A98]';
                } else {
                    numClass += ' text-gray-800';
                }

                html += `<div class="${cellClass}">`;
                html += `<div class="${numClass}">${date.getDate()}`;
                if (isToday) {
                    html += ` <span class="text-xs font-normal opacity-80">${isEnPage ? 'Today' : '오늘'}</span>`;
                }
                html += '</div>';

                // 일정 목록
                dayEvents.forEach(event => {
                    const textColor = isToday ? 'text-white/90' : 'text-gray-700';
                    const subTextColor = isToday ? 'text-white/70' : 'text-gray-500';
                    const dotColor = isToday ? 'bg-white' : '';
                    const hoverBg = isToday ? 'hover:bg-white/20' : 'hover:bg-gray-100';

                    // 시간 | 장소 조합
                    let timeLocation = event.time || '';
                    if (event.location) {
                        timeLocation += timeLocation ? ' | ' + event.location : event.location;
                    }

                    html += `
                        <div class="block text-xs rounded p-0.5 sm:p-1 -mx-0.5 sm:-mx-1 mb-1">
                            <div class="flex items-start gap-1 ${textColor}">
                                <span class="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${dotColor}" style="background-color: ${isToday ? 'white' : event.color}"></span>
                                <span class="font-medium">${event.title}</span>
                            </div>
                            ${timeLocation ? `<div class="ml-2.5 text-[10px] ${subTextColor}">${timeLocation}</div>` : ''}
                            ${event.description && !event.description.startsWith('http') ? `<div class="ml-2.5 text-[10px] ${subTextColor} truncate">${event.description.split('\\n')[0]}</div>` : ''}
                        </div>
                    `;
                });

                html += '</div>';
            }

            html += '</div>';
        }

        grid.innerHTML = html;
    },

    // 일정 리스트 렌더링
    renderEventList: function() {
        const list = document.getElementById('event-list');
        if (!list) return;

        const isEnPage = window.location.pathname.startsWith('/en/') || window.location.pathname === '/en';

        // 오늘 이후 일정만 필터링
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingEvents = this.events
            .filter(e => new Date(e.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5);

        if (upcomingEvents.length === 0) {
            list.innerHTML = `<p class="text-gray-500 text-center py-8">${isEnPage ? 'No upcoming events.' : '예정된 일정이 없습니다.'}</p>`;
            return;
        }

        let html = '';
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date);
            const dayNames = isEnPage 
                ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                : ['일', '월', '화', '수', '목', '금', '토'];

            html += `
                <a href="${event.url}" class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border-l-4" style="border-left-color: ${event.color}">
                    <div class="flex-shrink-0 w-12 sm:w-14 text-center">
                        <div class="text-xl sm:text-2xl font-bold text-gray-800">${eventDate.getDate()}</div>
                        <div class="text-xs text-gray-500">${dayNames[eventDate.getDay()]}</div>
                    </div>
                    <div class="flex-grow min-w-0">
                        <h5 class="font-semibold text-gray-800 truncate">${event.title}</h5>
                        <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-1">
                            <span><i class="far fa-clock mr-1"></i>${event.time}</span>
                            ${event.location ? `<span class="hidden sm:inline"><i class="fas fa-map-marker-alt mr-1"></i>${event.location}</span>` : ''}
                        </div>
                    </div>
                    <div class="flex-shrink-0">
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </div>
                </a>
            `;
        });

        list.innerHTML = html;
    },

    // 오류 표시
    showError: function(message) {
        const grid = document.getElementById('calendar-grid');
        const list = document.getElementById('event-list');
        
        if (grid) {
            grid.innerHTML = `<div class="text-center text-red-500 py-8">${message}</div>`;
        }
        if (list) {
            list.innerHTML = `<div class="text-center text-red-500 py-4">${message}</div>`;
        }
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calendar-widget')) {
        CalendarWidget.init();
    }
});
