// 운영 사이트 local-chapters.html에서 추출한 실제 데이터

export interface SocialChannel {
  type: 'email' | 'kakao' | 'blog' | 'instagram' | 'threads' | 'twitter' | 'facebook' | 'youtube' | 'discord'
  name: string
  url: string
  description?: string
  disabled?: boolean
}

export interface Committee {
  name: string
  url: string
}

export interface Province {
  id: string
  name: string
  fullName: string
  hasData: boolean
  status: 'established' | 'preparing' | 'inactive'
  leader: string | null
  leaderTitle: string | null
  officers?: { title: string; name: string }[]
  channels?: SocialChannel[]
  committees?: Committee[]
  districts?: { name: string; url: string; dongs?: string[]; chairman?: string | null }[]
}

export const provinces: Province[] = [
  { 
    id: 'seoul', 
    name: '서울', 
    fullName: '서울특별시당', 
    hasData: true, 
    status: 'established', 
    leader: '최현욱', 
    leaderTitle: '위원장',
    officers: [
      { title: '위원장', name: '최현욱' },
      { title: '부위원장', name: '한성학' },
      { title: '사무처장', name: '문미영' },
    ],
    channels: [
      { type: 'email', name: '공식 문의 e-mail', url: 'mailto:seoul@freeinno.kr', description: 'seoul@freeinno.kr' },
      { type: 'kakao', name: '공지 전용 카카오톡 오픈채팅방', url: 'https://open.kakao.com/o/gvs2bA5h' },
      { type: 'blog', name: '네이버 블로그', url: '#', description: '확보 예정', disabled: true },
      { type: 'instagram', name: '인스타그램', url: 'https://www.instagram.com/freeinno_seoul' },
      { type: 'threads', name: '스레드', url: 'https://www.threads.com/@freeinno_seoul' },
      { type: 'twitter', name: '엑스(구 트위터)', url: 'https://x.com/freeinno_seoul' },
      { type: 'facebook', name: '페이스북', url: 'https://www.facebook.com/profile.php?id=61575897083498' },
      { type: 'youtube', name: '유튜브 채널', url: 'https://www.youtube.com/@freeinno_seoul' },
      { type: 'discord', name: '디스코드(온라인 당사)', url: '#', description: '필요시에만 링크 공유', disabled: true },
    ],
    committees: [
      { name: '홍보분과', url: 'https://invite.kakao.com/tc/otfoxuy2HS' },
      { name: '조직강화분과', url: 'https://invite.kakao.com/tc/3mS6hHHXby' },
      { name: '정책분과', url: 'https://invite.kakao.com/tc/V5Sw3TgOcl' },
      { name: '투쟁분과', url: 'https://invite.kakao.com/tc/HhMLfyDGMb' },
      { name: '자원봉사단', url: 'https://invite.kakao.com/tc/zeFFJuImTP' },
    ],
    districts: [
      { name: '강남 갑', url: 'https://invite.kakao.com/tc/Q8wb5DlMvv', dongs: ['신사동', '논현1동', '논현2동', '압구정동', '청담동', '역삼1동', '역삼2동'] },
      { name: '강남 을', url: 'https://invite.kakao.com/tc/S4LzmhDFK8', dongs: ['개포1동', '개포2동', '개포4동', '세곡동', '일원본동', '일원1동', '일원2동', '수서동'] },
      { name: '강남 병', url: 'https://invite.kakao.com/tc/x6dqGoh3rh', dongs: ['삼성1동', '삼성2동', '대치1동', '대치2동', '대치4동', '도곡1동', '도곡2동'] },
      { name: '강동 갑', url: 'https://invite.kakao.com/tc/FcT9mRIBrN', dongs: ['암사1동', '암사2동', '암사3동', '명일1동', '명일2동', '고덕1동', '고덕2동', '강일동', '상일동'] },
      { name: '강동 을', url: 'https://invite.kakao.com/tc/ssYGTEfE9Z', dongs: ['천호1동', '천호2동', '천호3동', '성내1동', '성내2동', '성내3동', '둔촌1동', '둔촌2동', '길동'] },
      { name: '강북 갑', url: 'https://invite.kakao.com/tc/uXwwzfwwxH', dongs: ['번1동', '번2동', '우이동', '인수동', '수유1동', '수유2동', '수유3동'] },
      { name: '강북 을', url: 'https://invite.kakao.com/tc/wv1NiWfyvm', dongs: ['번3동', '삼양동', '미아동', '송중동', '송천동', '삼각산동'] },
      { name: '강서 갑', url: 'https://invite.kakao.com/tc/wErhlclI9J', dongs: ['발산1동', '우장산동', '화곡1동', '화곡2동', '화곡3동', '화곡8동'] },
      { name: '강서 을', url: 'https://invite.kakao.com/tc/VYfa9v0bOv', dongs: ['가양1동', '가양2동', '등촌3동', '공항동', '방화1동', '방화2동', '방화3동'] },
      { name: '강서 병', url: 'https://invite.kakao.com/tc/Gdp6xnhlj3', dongs: ['등촌1동', '등촌2동', '가양3동', '염창동', '화곡4동', '화곡6동', '화곡본동'] },
      { name: '구로 갑', url: 'https://invite.kakao.com/tc/Grmew30A5t', dongs: ['개봉1동', '개봉2동', '개봉3동', '고척1동', '고척2동', '오류1동', '오류2동', '수궁동', '항동'] },
      { name: '구로 을', url: 'https://invite.kakao.com/tc/I726mhYDub', dongs: ['구로1동', '구로2동', '구로3동', '구로4동', '구로5동', '신도림동', '가리봉동'] },
      { name: '금천', url: 'https://invite.kakao.com/tc/w16GSt7hM3', dongs: ['가산동', '독산1동', '독산2동', '독산3동', '독산4동', '시흥1동', '시흥2동', '시흥3동', '시흥4동', '시흥5동'] },
      { name: '관악 갑', url: 'https://invite.kakao.com/tc/N4ktmdyDsu', dongs: ['보라매동', '은천동', '성현동', '중앙동', '청림동', '행운동', '청룡동', '낙성대동', '인헌동', '남현동', '신림동'] },
      { name: '관악 을', url: 'https://invite.kakao.com/tc/fcjfBmwKhU', dongs: ['신사동', '조원동', '미성동', '난곡동', '난향동', '서원동', '신원동', '서림동', '삼성동', '대학동'] },
      { name: '광진 갑', url: 'https://invite.kakao.com/tc/r8sPIxP2Ic', dongs: ['중곡1동', '중곡2동', '중곡3동', '중곡4동', '구의2동', '군자동', '광장동', '능동'] },
      { name: '광진 을', url: 'https://invite.kakao.com/tc/klUmEYr6R5', dongs: ['자양1동', '자양2동', '자양3동', '자양4동', '구의1동', '구의3동', '화양동'] },
      { name: '노원 갑', url: 'https://invite.kakao.com/tc/DkaUzITz8M', dongs: ['월계1동', '월계2동', '월계3동', '공릉1동', '공릉2동', '하계1동', '하계2동', '중계본동', '중계2·3동'] },
      { name: '노원 을', url: 'https://invite.kakao.com/tc/WKKZQElR61', dongs: ['중계1동', '중계4동', '상계1동', '상계2동', '상계3·4동', '상계5동', '상계6·7동', '상계8동', '상계9동', '상계10동'] },
      { name: '도봉 갑', url: 'https://invite.kakao.com/tc/AHsy504VSN', dongs: ['쌍문1동', '쌍문3동', '창1동', '창2동', '창3동', '창4동', '창5동'] },
      { name: '도봉 을', url: 'https://invite.kakao.com/tc/YWWlpiWiyP', dongs: ['쌍문2동', '쌍문4동', '방학1동', '방학2동', '방학3동', '도봉1동', '도봉2동'] },
      { name: '동대문 갑', url: 'https://invite.kakao.com/tc/TN2TrcPwuz', dongs: ['휘경1동', '휘경2동', '이문1동', '이문2동', '청량리동', '용신동', '제기동', '회기동'] },
      { name: '동대문 을', url: 'https://invite.kakao.com/tc/TXG50mNKB5', dongs: ['전농1동', '전농2동', '장안1동', '장안2동', '답십리1동', '답십리2동'] },
      { name: '동작 갑', url: 'https://invite.kakao.com/tc/0nADJCg2rZ', dongs: ['대방동', '상도2동', '상도3동', '상도4동', '노량진1동', '노량진2동', '신대방1동', '신대방2동'] },
      { name: '동작 을', url: 'https://invite.kakao.com/tc/GSC2GXAsje', dongs: ['흑석동', '상도1동', '사당1동', '사당2동', '사당3동', '사당4동', '사당5동'] },
      { name: '마포 갑', url: 'https://invite.kakao.com/tc/PqCdf56vor', dongs: ['공덕동', '아현동', '도화동', '용강동', '대흥동', '염리동', '신수동'] },
      { name: '마포 을', url: 'https://invite.kakao.com/tc/nfAJ6PPiB8', dongs: ['서강동', '서교동', '합정동', '망원1동', '망원2동', '연남동', '성산1동', '성산2동', '상암동'] },
      { name: '서초 갑', url: 'https://invite.kakao.com/tc/XdLoR2RbAz', dongs: ['잠원동', '반포본동', '반포1동', '반포2동', '반포3동', '반포4동', '방배본동', '방배1동', '방배4동'] },
      { name: '서초 을', url: 'https://invite.kakao.com/tc/EUABKmafwi', dongs: ['서초1동', '서초2동', '서초3동', '서초4동', '방배2동', '방배3동', '양재1동', '양재2동', '내곡동'] },
      { name: '서대문 갑', url: 'https://invite.kakao.com/tc/06h4F8WWAo', dongs: ['홍제1동', '홍제2동', '북아현동', '천연동', '충현동', '신촌동', '연희동'] },
      { name: '서대문 을', url: 'https://invite.kakao.com/tc/7nr9xEqDTL', dongs: ['홍은1동', '홍은2동', '홍제3동', '남가좌1동', '남가좌2동', '북가좌1동', '북가좌2동'] },
      { name: '성북 갑', url: 'https://invite.kakao.com/tc/O9tfteKLJH', dongs: ['길음1동', '돈암2동', '안암동', '보문동', '정릉1동', '정릉2동', '정릉3동', '정릉4동', '성북동', '삼선동', '동선동'] },
      { name: '성북 을', url: 'https://invite.kakao.com/tc/k2oQly2OBf', dongs: ['돈암1동', '길음2동', '종암동', '석관동', '장위1동', '장위2동', '장위3동', '월곡1동', '월곡2동'] },
      { name: '송파 갑', url: 'https://invite.kakao.com/tc/IJ6cVgFYnz', dongs: ['풍납1동', '풍납2동', '방이1동', '방이2동', '오륜동', '송파1동', '송파2동', '잠실4동', '잠실6동'] },
      { name: '송파 을', url: 'https://invite.kakao.com/tc/nvfOMcNioq', dongs: ['석촌동', '삼전동', '가락1동', '문정2동', '잠실본동', '잠실2동', '잠실3동', '잠실7동'] },
      { name: '송파 병', url: 'https://invite.kakao.com/tc/eu0aGBXRPr', dongs: ['거여1동', '거여2동', '마천1동', '마천2동', '오금동', '가락본동', '가락2동', '문정1동', '장지동', '위례동'] },
      { name: '양천 갑', url: 'https://invite.kakao.com/tc/C7H1vPh9Pg', dongs: ['목1동', '목2동', '목3동', '목4동', '목5동', '신정1동', '신정2동', '신정6동', '신정7동'] },
      { name: '양천 을', url: 'https://invite.kakao.com/tc/WRQQzVfmF8', dongs: ['신월1동', '신월2동', '신월3동', '신월4동', '신월5동', '신월6동', '신월7동', '신정3동', '신정4동'] },
      { name: '영등포 갑', url: 'https://invite.kakao.com/tc/x5ceRq3oE9', dongs: ['신길3동', '당산1동', '당산2동', '양평1동', '양평2동', '문래동', '영등포동', '영등포본동', '도림동'] },
      { name: '영등포 을', url: 'https://invite.kakao.com/tc/q4hFQbBpD9', dongs: ['신길1동', '신길4동', '신길5동', '신길6동', '신길7동', '여의동', '대림1동', '대림2동', '대림3동'] },
      { name: '용산', url: 'https://invite.kakao.com/tc/YcmlIpCTb6', dongs: ['후암동', '용산2가동', '남영동', '청파동', '원효로1동', '원효로2동', '효창동', '용문동', '한강로동', '이촌1동', '이촌2동', '이태원1동', '이태원2동', '한남동', '서빙고동', '보광동'] },
      { name: '은평 갑', url: 'https://invite.kakao.com/tc/n9yxNBceDv', dongs: ['녹번동', '역촌동', '증산동', '신사1동', '신사2동', '응암1동', '응암2동', '응암3동', '수색동'] },
      { name: '은평 을', url: 'https://invite.kakao.com/tc/7WeyD9KkWP', dongs: ['구산동', '대조동', '진관동', '갈현1동', '갈현2동', '불광1동', '불광2동'] },
      { name: '중랑 갑', url: 'https://invite.kakao.com/tc/YMpTN9y6Yg', dongs: ['상봉2동', '망우3동', '면목본동', '면목2동', '면목4동', '면목5동', '면목3·8동', '면목7동'] },
      { name: '중랑 을', url: 'https://invite.kakao.com/tc/WKuJmQUz54', dongs: ['상봉1동', '망우본동', '중화1동', '중화2동', '신내1동', '신내2동', '묵1동', '묵2동'] },
      { name: '중성동 갑', url: 'https://invite.kakao.com/tc/6yYTIR5SkZ', dongs: ['마장동', '사근동', '응봉동', '송정동', '용답동', '행당1동', '행당2동', '성수1가1동', '성수1가2동', '성수2가1동', '성수2가3동', '왕십리·도선동', '왕십리2동'] },
      { name: '중성동 을', url: 'https://invite.kakao.com/tc/Wl4H4R4eAX', dongs: ['소공동', '회현동', '명동', '필동', '장충동', '광희동', '을지로동', '신당동', '다산동', '약수동', '청구동', '동화동', '황학동', '중림동', '금호1가동', '금호2·3가동', '금호4가동', '옥수동'] },
      { name: '종로', url: 'https://invite.kakao.com/tc/wC6aK7wKad', dongs: ['청운효자동', '사직동', '삼청동', '부암동', '평창동', '무악동', '교남동', '가회동', '종로1·2·3·4가동', '종로5·6가동', '이화동', '혜화동', '창신1동', '창신2동', '창신3동', '숭인1동', '숭인2동'] },
    ]
  },
  { 
    id: 'busan', 
    name: '부산', 
    fullName: '부산광역시당', 
    hasData: true, 
    status: 'established', 
    leader: '서미란', 
    leaderTitle: '위원장',
    channels: [
      { type: 'email', name: '공식 문의 e-mail', url: 'mailto:busan@freeinno.kr', description: 'busan@freeinno.kr' },
      { type: 'kakao', name: '공지 전용 카카오톡 오픈채팅방', url: 'https://open.kakao.com/o/g8zkGj6h' },
    ],
    districts: [
      { 
        name: '중구·영도구', 
        url: 'https://invite.kakao.com/tc/Oq56MsfE1D',
        dongs: ['중앙동', '동광동', '대청동', '보수동', '부평동', '광복동', '남포동', '영주1동', '영주2동', '남항동', '영선1동', '영선2동', '신선동', '봉래1동', '봉래2동', '청학1동', '청학2동', '동삼1동', '동삼2동', '동삼3동']
      },
      { 
        name: '서구·동구', 
        url: 'https://invite.kakao.com/tc/PmtKMokl0i',
        dongs: ['동대신1동', '동대신2동', '동대신3동', '서대신1동', '서대신2동', '서대신3동', '서대신4동', '부민동', '아미동', '초장동', '충무동', '남부민1동', '남부민2동', '암남동', '초량1동', '초량2동', '초량3동', '초량6동', '수정1동', '수정2동', '수정4동', '수정5동', '좌천동', '범일1동', '범일2동', '범일5동']
      },
      { 
        name: '부산진구 갑', 
        url: 'https://invite.kakao.com/tc/SUAepGI4KL',
        dongs: ['부전1동', '당감1동', '당감2동', '당감4동', '양정1동', '양정2동', '부암1동', '부암3동', '연지동', '초읍동']
      },
      { 
        name: '부산진구 을', 
        url: 'https://invite.kakao.com/tc/XMYpk9OZ5a',
        dongs: ['부전2동', '개금1동', '개금2동', '개금3동', '가야1동', '가야2동', '범천1동', '범천2동', '전포1동', '전포2동']
      },
      { 
        name: '동래구', 
        url: 'https://invite.kakao.com/tc/yNpkdSIGe8',
        dongs: ['수민동', '복산동', '명륜동', '온천1동', '온천2동', '온천3동', '사직1동', '사직2동', '사직3동', '안락1동', '안락2동', '명장1동']
      },
      { 
        name: '남구 갑', 
        url: 'https://invite.kakao.com/tc/1xqLFrUWeH',
        dongs: ['문현1동', '문현2동', '문현3동', '문현4동', '대연4동', '대연5동', '대연6동', '감만1동', '감만2동', '용당동', '우암동']
      },
      { 
        name: '남구 을', 
        url: 'https://invite.kakao.com/tc/mMHJtX2L5c',
        dongs: ['용호1동', '용호2동', '용호3동', '용호4동', '대연1동', '대연3동']
      },
      { 
        name: '북구·강서구 갑', 
        url: 'https://invite.kakao.com/tc/RTrnZPh2sm',
        dongs: ['구포1동', '구포2동', '구포3동', '덕천1동', '덕천2동', '덕천3동', '만덕1동', '만덕2동', '만덕3동']
      },
      { 
        name: '북구·강서구 을', 
        url: 'https://invite.kakao.com/tc/wHlqCJ4N6a',
        dongs: ['화명동', '금곡동', '대저1동', '대저2동', '강동동', '명지동', '가락동', '녹산동', '천가동']
      },
      { 
        name: '해운대구 갑', 
        url: 'https://invite.kakao.com/tc/7d0cjksCQY',
        dongs: ['좌1동', '좌2동', '좌3동', '좌4동', '중1동', '중2동', '우1동', '우2동', '우3동', '송정동']
      },
      { 
        name: '해운대구 을', 
        url: 'https://invite.kakao.com/tc/QexgZFJMhO',
        dongs: ['반여1동', '반여2동', '반여3동', '반여4동', '반송1동', '반송2동', '재송1동', '재송2동']
      },
      { 
        name: '사하구 갑', 
        url: 'https://invite.kakao.com/tc/rEo8LJxvwC',
        dongs: ['당리동', '하단1동', '하단2동', '괴정1동', '괴정2동', '괴정3동', '괴정4동']
      },
      { 
        name: '사하구 을', 
        url: 'https://invite.kakao.com/tc/CaaVlJVYiX',
        dongs: ['구평동', '장림1동', '장림2동', '신평1동', '신평2동', '다대1동', '다대2동', '감천1동', '감천2동']
      },
      { 
        name: '금정구', 
        url: 'https://invite.kakao.com/tc/YUtX9wMgjp',
        dongs: ['서1동', '서2동', '서3동', '금사회동동', '부곡1동', '부곡2동', '부곡3동', '부곡4동', '장전1동', '장전2동', '선두구동', '청룡노포동', '남산동', '구서1동', '구서2동', '금성동']
      },
      { 
        name: '연제구', 
        url: 'https://invite.kakao.com/tc/EXr6RivjbV',
        dongs: ['거제1동', '거제2동', '거제3동', '거제4동', '연산1동', '연산2동', '연산3동', '연산4동', '연산5동', '연산6동', '연산7동', '연산8동', '연산9동']
      },
      { 
        name: '수영구', 
        url: 'https://invite.kakao.com/tc/iyzikswQya',
        dongs: ['남천1동', '남천2동', '수영동', '망미1동', '망미2동', '광안1동', '광안2동', '광안3동', '광안4동', '민락동']
      },
      { 
        name: '사상구', 
        url: 'https://invite.kakao.com/tc/IwBnemjPOs',
        dongs: ['삼락동', '모라1동', '모라3동', '덕포1동', '덕포2동', '괘법동', '감전동', '주례1동', '주례2동', '주례3동', '학장동', '엄궁동']
      },
      { 
        name: '기장군', 
        url: 'https://invite.kakao.com/tc/hzoL3BEYM8',
        dongs: ['기장읍', '장안읍', '정관읍', '일광읍', '철마면']
      },
    ]
  },
  { 
    id: 'gyeongbuk', 
    name: '경북', 
    fullName: '경상북도당', 
    hasData: true, 
    status: 'established', 
    leader: '차훈', 
    leaderTitle: '위원장',
    channels: [
      { type: 'email', name: '공식 문의 e-mail', url: 'mailto:gyeongbuk@freeinno.kr', description: 'gyeongbuk@freeinno.kr' },
      { type: 'kakao', name: '공지 전용 카카오톡 오픈채팅방', url: 'https://open.kakao.com/o/gffKtR6h' },
    ],
    districts: [
      {
        name: '포항시 북구',
        url: 'https://invite.kakao.com/tc/t0lbEN6tdZ',
        dongs: ['중앙동', '양학동', '죽도동', '용흥동', '우창동', '두호동', '장량동', '환여동', '흥해읍', '신광면', '청하면', '송라면', '기계면', '죽장면', '기북면']
      },
      {
        name: '포항시 남구·울릉군',
        url: 'https://invite.kakao.com/tc/8uA3XoVKJE',
        dongs: ['상대동', '해도동', '송도동', '청림동', '제철동', '효곡동', '대이동', '구룡포읍', '연일읍', '오천읍', '대송면', '동해면', '장기면', '호미곶면']
      },
      {
        name: '경주시',
        url: 'https://invite.kakao.com/tc/Hdz6G5cLLW',
        dongs: ['중부동', '황오동', '성건동', '황남동', '월성동', '선도동', '용강동', '황성동', '동천동', '불국동', '보덕동', '감포읍', '안강읍', '외동읍', '양북면', '양남면', '내남면', '산내면', '서면', '현곡면', '강동면', '천북면']
      },
      {
        name: '김천시',
        url: 'https://invite.kakao.com/tc/KqTP57ho6u',
        dongs: ['자산동', '평화·남산동', '양·금동', '대·신동', '대곡동', '지좌동', '율곡동', '아포읍', '농소면', '남면', '개령면', '감문면', '어모면', '봉산면', '대항면', '감천면', '조마면', '구성면', '지례면', '부항면', '대덕면', '증산면']
      },
      {
        name: '안동시·예천군',
        url: 'https://invite.kakao.com/tc/Anxu0BHhww',
        dongs: ['풍산읍', '와룡면', '북후면', '서후면', '풍천면', '일직면', '남후면', '남선면', '임하면', '길안면', '임동면', '예안면', '도산면', '녹전면', '예천읍', '호명읍', '용문면', '효자면', '은풍면', '감천면', '보문면', '유천면', '용궁면', '개포면', '지보면', '풍양면']
      },
      {
        name: '구미시 갑',
        url: 'https://invite.kakao.com/tc/PTkZQW8tmg',
        dongs: ['송정동', '원평동', '지산동', '도량동', '선주원남동', '형곡1동', '형곡2동', '신평1동', '신평2동', '비산동', '공단동', '광평동', '상모사곡동', '임오동']
      },
      {
        name: '구미시 을',
        url: 'https://invite.kakao.com/tc/uJ2BlB2q1r',
        dongs: ['인동동', '진미동', '양포동', '선산읍', '고아읍', '산동읍', '무을면', '옥성면', '도개면', '해평면', '장천면']
      },
      {
        name: '영주시·영양군·봉화군',
        url: 'https://invite.kakao.com/tc/vRYMKszTFh',
        dongs: ['상망동', '하망동', '영주1동', '영주2동', '휴천1동', '휴천2동', '휴천3동', '가흥1동', '가흥2동', '풍기읍', '이산면', '평은면', '문수면', '장수면', '안정면', '봉현면', '순흥면', '단산면', '부석면', '영양읍', '입암면', '청기면', '일월면', '수비면', '석보면', '봉화읍', '물야면', '봉성면', '법전면', '춘양면', '소천면', '석포면', '재산면', '명호면', '상운면']
      },
      {
        name: '영천시·청도군',
        url: 'https://invite.kakao.com/tc/XTzJN14lwG',
        dongs: ['동부동', '중앙동', '서부동', '완산동', '남부동', '금호읍', '청통면', '신녕면', '화산면', '화북면', '화남면', '자양면', '임고면', '고경면', '북안면', '대창면', '청도읍', '화양읍', '각남면', '풍각면', '각북면', '이서면', '운문면', '금천면', '매전면']
      },
      {
        name: '상주시·문경시',
        url: 'https://invite.kakao.com/tc/3bISKEblL2',
        dongs: ['점촌1동', '점촌2동', '점촌3동', '점촌4동', '점촌5동', '문경읍', '가은읍', '영순면', '산양면', '호계면', '산북면', '동로면', '마성면', '농암면']
      },
      {
        name: '경산시',
        url: 'https://invite.kakao.com/tc/59cgVxihIr',
        dongs: ['중앙동', '동부동', '서부1동', '서부2동', '남부동', '북부동', '중방동', '하양읍', '진량읍', '압량읍', '와촌면', '자인면', '용성면', '남산면', '남천면']
      },
      {
        name: '의성군·청송군·영덕군·울진군',
        url: 'https://invite.kakao.com/tc/FITj2jDKrM',
        dongs: ['의성읍', '단촌면', '점곡면', '옥산면', '사곡면', '춘산면', '가음면', '금성면', '봉양면', '비안면', '구천면', '단밀면', '단북면', '안계면', '다인면', '신평면', '안평면', '안사면', '청송읍', '주왕산면', '부남면', '현동면', '현서면', '안덕면', '파천면', '진보면', '영덕읍', '강구면', '남정면', '달산면', '지품면', '축산면', '영해면', '병곡면', '창수면', '울진읍', '평해읍', '북면', '금강송면', '근남면', '매화면', '기성면', '온정면', '죽변면', '후포면']
      },
      {
        name: '고령군·성주군·칠곡군',
        url: 'https://invite.kakao.com/tc/qlyL91gR14',
        dongs: ['대가야읍', '덕곡면', '운수면', '성산면', '다산면', '개진면', '우곡면', '쌍림면', '성주읍', '선남면', '용암면', '수륜면', '가천면', '금수면', '대가면', '벽진면', '초전면', '월항면', '왜관읍', '북삼읍', '석적읍', '지천면', '동명면', '가산면', '약목면', '기산면']
      },
    ]
  },
  { id: 'gyeonggi', name: '경기', fullName: '경기도당', hasData: false, status: 'established', leader: '조성범', leaderTitle: '위원장' },
  { id: 'incheon', name: '인천', fullName: '인천광역시당', hasData: false, status: 'established', leader: '권오용', leaderTitle: '위원장' },
  { id: 'daegu', name: '대구', fullName: '대구광역시당', hasData: false, status: 'established', leader: '황현정', leaderTitle: '위원장' },
  { id: 'daejeon', name: '대전', fullName: '대전광역시당', hasData: false, status: 'preparing', leader: '김재훈', leaderTitle: '창준위원장' },
  { id: 'gwangju', name: '광주', fullName: '광주광역시당', hasData: false, status: 'preparing', leader: '황현철', leaderTitle: '위원장' },
  { id: 'ulsan', name: '울산', fullName: '울산광역시당', hasData: false, status: 'established', leader: '지광선', leaderTitle: '위원장' },
  { id: 'sejong', name: '세종', fullName: '세종특별자치시당', hasData: false, status: 'inactive', leader: null, leaderTitle: null },
  { id: 'gangwon', name: '강원', fullName: '강원특별자치도당', hasData: false, status: 'preparing', leader: '이수동', leaderTitle: '위원장' },
  { id: 'chungbuk', name: '충북', fullName: '충청북도당', hasData: false, status: 'preparing', leader: '김기현', leaderTitle: '창준위원장' },
  { id: 'chungnam', name: '충남', fullName: '충청남도당', hasData: false, status: 'preparing', leader: '강창모', leaderTitle: '위원장' },
  { id: 'gyeongnam', name: '경남', fullName: '경상남도당', hasData: false, status: 'established', leader: '김진일', leaderTitle: '위원장' },
  { id: 'jeonbuk', name: '전북', fullName: '전북특별자치도당', hasData: false, status: 'inactive', leader: null, leaderTitle: null },
  { id: 'jeonnam', name: '전남', fullName: '전라남도당', hasData: false, status: 'inactive', leader: null, leaderTitle: null },
  { id: 'jeju', name: '제주', fullName: '제주특별자치도당', hasData: false, status: 'preparing', leader: '이누림', leaderTitle: '위원장' }
]

export const establishedProvinces = provinces.filter(p => p.status === 'established')
export const preparingProvinces = provinces.filter(p => p.status === 'preparing')
export const inactiveProvinces = provinces.filter(p => p.status === 'inactive')

// 아이콘 매핑
export const channelIcons: Record<string, string> = {
  email: 'fas fa-envelope',
  kakao: 'fas fa-comment',
  blog: 'fas fa-blog',
  instagram: 'fab fa-instagram',
  threads: 'fas fa-at',
  twitter: 'fab fa-x-twitter',
  facebook: 'fab fa-facebook',
  youtube: 'fab fa-youtube',
  discord: 'fab fa-discord',
}
