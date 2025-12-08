// 서울 49개 지역구 초기 데이터 삽입 스크립트
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const { Chapter } = require('./models');

const seoulChapters = [
    {
        name: "강남 갑",
        dongs: ["신사동", "논현1동", "논현2동", "압구정동", "청담동", "역삼1동", "역삼2동"],
        kakaoLink: "https://invite.kakao.com/tc/Q8wb5DlMvv"
    },
    {
        name: "강남 을",
        dongs: ["개포1동", "개포2동", "개포4동", "세곡동", "일원본동", "일원1동", "일원2동", "수서동"],
        kakaoLink: "https://invite.kakao.com/tc/S4LzmhDFK8"
    },
    {
        name: "강남 병",
        dongs: ["삼성1동", "삼성2동", "대치1동", "대치2동", "대치4동", "도곡1동", "도곡2동"],
        kakaoLink: "https://invite.kakao.com/tc/x6dqGoh3rh",
        chairmanName: "한성학"
    },
    {
        name: "강동 갑",
        dongs: ["암사1동", "암사2동", "암사3동", "명일1동", "명일2동", "고덕1동", "고덕2동", "강일동", "상일동"],
        kakaoLink: "https://invite.kakao.com/tc/FcT9mRIBrN"
    },
    {
        name: "강동 을",
        dongs: ["천호1동", "천호2동", "천호3동", "성내1동", "성내2동", "성내3동", "둔촌1동", "둔촌2동", "길동"],
        kakaoLink: "https://invite.kakao.com/tc/ssYGTEfE9Z"
    },
    {
        name: "강북 갑",
        dongs: ["번1동", "번2동", "우이동", "인수동", "수유1동", "수유2동", "수유3동"],
        kakaoLink: "https://invite.kakao.com/tc/uXwwzfwwxH"
    },
    {
        name: "강북 을",
        dongs: ["번3동", "삼양동", "미아동", "송중동", "송천동", "삼각산동"],
        kakaoLink: "https://invite.kakao.com/tc/wv1NiWfyvm"
    },
    {
        name: "강서 갑",
        dongs: ["발산1동", "우장산동", "화곡1동", "화곡2동", "화곡3동", "화곡8동"],
        kakaoLink: "https://invite.kakao.com/tc/wErhlclI9J"
    },
    {
        name: "강서 을",
        dongs: ["가양1동", "가양2동", "등촌3동", "공항동", "방화1동", "방화2동", "방화3동"],
        kakaoLink: "https://invite.kakao.com/tc/VYfa9v0bOv"
    },
    {
        name: "강서 병",
        dongs: ["등촌1동", "등촌2동", "가양3동", "염창동", "화곡4동", "화곡6동", "화곡본동"],
        kakaoLink: "https://invite.kakao.com/tc/Gdp6xnhlj3"
    },
    {
        name: "구로 갑",
        dongs: ["개봉1동", "개봉2동", "개봉3동", "고척1동", "고척2동", "오류1동", "오류2동", "수궁동", "항동"],
        kakaoLink: "https://invite.kakao.com/tc/Grmew30A5t"
    },
    {
        name: "구로 을",
        dongs: ["구로1동", "구로2동", "구로3동", "구로4동", "구로5동", "신도림동", "가리봉동"],
        kakaoLink: "https://invite.kakao.com/tc/I726mhYDub"
    },
    {
        name: "금천",
        dongs: ["가산동", "독산1동", "독산2동", "독산3동", "독산4동", "시흥1동", "시흥2동", "시흥3동", "시흥4동", "시흥5동"],
        kakaoLink: "https://invite.kakao.com/tc/w16GSt7hM3"
    },
    {
        name: "관악 갑",
        dongs: ["보라매동", "은천동", "성현동", "중앙동", "청림동", "행운동", "청룡동", "낙성대동", "인헌동", "남현동", "신림동"],
        kakaoLink: "https://invite.kakao.com/tc/N4ktmdyDsu"
    },
    {
        name: "관악 을",
        dongs: ["신사동", "조원동", "미성동", "난곡동", "난향동", "서원동", "신원동", "서림동", "삼성동", "대학동"],
        kakaoLink: "https://invite.kakao.com/tc/fcjfBmwKhU"
    },
    {
        name: "광진 갑",
        dongs: ["중곡1동", "중곡2동", "중곡3동", "중곡4동", "구의2동", "군자동", "광장동", "능동"],
        kakaoLink: "https://invite.kakao.com/tc/r8sPIxP2Ic"
    },
    {
        name: "광진 을",
        dongs: ["자양1동", "자양2동", "자양3동", "자양4동", "구의1동", "구의3동", "화양동"],
        kakaoLink: "https://invite.kakao.com/tc/klUmEYr6R5"
    },
    {
        name: "노원 갑",
        dongs: ["월계1동", "월계2동", "월계3동", "공릉1동", "공릉2동", "하계1동", "하계2동", "중계본동", "중계2·3동"],
        kakaoLink: "https://invite.kakao.com/tc/DkaUzITz8M"
    },
    {
        name: "노원 을",
        dongs: ["중계1동", "중계4동", "상계1동", "상계2동", "상계3·4동", "상계5동", "상계6·7동", "상계8동", "상계9동", "상계10동"],
        kakaoLink: "https://invite.kakao.com/tc/WKKZQElR61"
    },
    {
        name: "도봉 갑",
        dongs: ["쌍문1동", "쌍문3동", "창1동", "창2동", "창3동", "창4동", "창5동"],
        kakaoLink: "https://invite.kakao.com/tc/AHsy504VSN"
    },
    {
        name: "도봉 을",
        dongs: ["쌍문2동", "쌍문4동", "방학1동", "방학2동", "방학3동", "도봉1동", "도봉2동"],
        kakaoLink: "https://invite.kakao.com/tc/YWWlpiWiyP"
    },
    {
        name: "동대문 갑",
        dongs: ["휘경1동", "휘경2동", "이문1동", "이문2동", "청량리동", "용신동", "제기동", "회기동"],
        kakaoLink: "https://invite.kakao.com/tc/TN2TrcPwuz"
    },
    {
        name: "동대문 을",
        dongs: ["전농1동", "전농2동", "장안1동", "장안2동", "답십리1동", "답십리2동"],
        kakaoLink: "https://invite.kakao.com/tc/TXG50mNKB5"
    },
    {
        name: "동작 갑",
        dongs: ["대방동", "상도2동", "상도3동", "상도4동", "노량진1동", "노량진2동", "신대방1동", "신대방2동"],
        kakaoLink: "https://invite.kakao.com/tc/0nADJCg2rZ"
    },
    {
        name: "동작 을",
        dongs: ["흑석동", "상도1동", "사당1동", "사당2동", "사당3동", "사당4동", "사당5동"],
        kakaoLink: "https://invite.kakao.com/tc/GSC2GXAsje"
    },
    {
        name: "마포 갑",
        dongs: ["공덕동", "아현동", "도화동", "용강동", "대흥동", "염리동", "신수동"],
        kakaoLink: "https://invite.kakao.com/tc/PqCdf56vor"
    },
    {
        name: "마포 을",
        dongs: ["서강동", "서교동", "합정동", "망원1동", "망원2동", "연남동", "성산1동", "성산2동", "상암동"],
        kakaoLink: "https://invite.kakao.com/tc/nfAJ6PPiB8"
    },
    {
        name: "서초 갑",
        dongs: ["잠원동", "반포본동", "반포1동", "반포2동", "반포3동", "반포4동", "방배본동", "방배1동", "방배4동"],
        kakaoLink: "https://invite.kakao.com/tc/XdLoR2RbAz"
    },
    {
        name: "서초 을",
        dongs: ["서초1동", "서초2동", "서초3동", "서초4동", "방배2동", "방배3동", "양재1동", "양재2동", "내곡동"],
        kakaoLink: "https://invite.kakao.com/tc/EUABKmafwi"
    },
    {
        name: "서대문 갑",
        dongs: ["홍제1동", "홍제2동", "북아현동", "천연동", "충현동", "신촌동", "연희동"],
        kakaoLink: "https://invite.kakao.com/tc/06h4F8WWAo"
    },
    {
        name: "서대문 을",
        dongs: ["홍은1동", "홍은2동", "홍제3동", "남가좌1동", "남가좌2동", "북가좌1동", "북가좌2동"],
        kakaoLink: "https://invite.kakao.com/tc/7nr9xEqDTL"
    },
    {
        name: "성북 갑",
        dongs: ["길음1동", "돈암2동", "안암동", "보문동", "정릉1동", "정릉2동", "정릉3동", "정릉4동", "성북동", "삼선동", "동선동"],
        kakaoLink: "https://invite.kakao.com/tc/O9tfteKLJH"
    },
    {
        name: "성북 을",
        dongs: ["돈암1동", "길음2동", "종암동", "석관동", "장위1동", "장위2동", "장위3동", "월곡1동", "월곡2동"],
        kakaoLink: "https://invite.kakao.com/tc/k2oQly2OBf"
    },
    {
        name: "송파 갑",
        dongs: ["풍납1동", "풍납2동", "방이1동", "방이2동", "오륜동", "송파1동", "송파2동", "잠실4동", "잠실6동"],
        kakaoLink: "https://invite.kakao.com/tc/IJ6cVgFYnz"
    },
    {
        name: "송파 을",
        dongs: ["석촌동", "삼전동", "가락1동", "문정2동", "잠실본동", "잠실2동", "잠실3동", "잠실7동"],
        kakaoLink: "https://invite.kakao.com/tc/nvfOMcNioq"
    },
    {
        name: "송파 병",
        dongs: ["거여1동", "거여2동", "마천1동", "마천2동", "오금동", "가락본동", "가락2동", "문정1동", "장지동", "위례동"],
        kakaoLink: "https://invite.kakao.com/tc/eu0aGBXRPr"
    },
    {
        name: "양천 갑",
        dongs: ["목1동", "목2동", "목3동", "목4동", "목5동", "신정1동", "신정2동", "신정6동", "신정7동"],
        kakaoLink: "https://invite.kakao.com/tc/C7H1vPh9Pg"
    },
    {
        name: "양천 을",
        dongs: ["신월1동", "신월2동", "신월3동", "신월4동", "신월5동", "신월6동", "신월7동", "신정3동", "신정4동"],
        kakaoLink: "https://invite.kakao.com/tc/WRQQzVfmF8"
    },
    {
        name: "영등포 갑",
        dongs: ["신길3동", "당산1동", "당산2동", "양평1동", "양평2동", "문래동", "영등포동", "영등포본동", "도림동"],
        kakaoLink: "https://invite.kakao.com/tc/x5ceRq3oE9"
    },
    {
        name: "영등포 을",
        dongs: ["신길1동", "신길4동", "신길5동", "신길6동", "신길7동", "여의동", "대림1동", "대림2동", "대림3동"],
        kakaoLink: "https://invite.kakao.com/tc/q4hFQbBpD9"
    },
    {
        name: "용산",
        dongs: ["후암동", "용산2가동", "남영동", "청파동", "원효로1동", "원효로2동", "효창동", "용문동", "한강로동", "이촌1동", "이촌2동", "이태원1동", "이태원2동", "한남동", "서빙고동", "보광동"],
        kakaoLink: "https://invite.kakao.com/tc/YcmlIpCTb6"
    },
    {
        name: "은평 갑",
        dongs: ["녹번동", "역촌동", "증산동", "신사1동", "신사2동", "응암1동", "응암2동", "응암3동", "수색동"],
        kakaoLink: "https://invite.kakao.com/tc/n9yxNBceDv"
    },
    {
        name: "은평 을",
        dongs: ["구산동", "대조동", "진관동", "갈현1동", "갈현2동", "불광1동", "불광2동"],
        kakaoLink: "https://invite.kakao.com/tc/7WeyD9KkWP"
    },
    {
        name: "중랑 갑",
        dongs: ["상봉2동", "망우3동", "면목본동", "면목2동", "면목4동", "면목5동", "면목3·8동", "면목7동"],
        kakaoLink: "https://invite.kakao.com/tc/YMpTN9y6Yg"
    },
    {
        name: "중랑 을",
        dongs: ["상봉1동", "망우본동", "중화1동", "중화2동", "신내1동", "신내2동", "묵1동", "묵2동"],
        kakaoLink: "https://invite.kakao.com/tc/WKuJmQUz54"
    },
    {
        name: "중성동 갑",
        dongs: ["마장동", "사근동", "응봉동", "송정동", "용답동", "행당1동", "행당2동", "성수1가1동", "성수1가2동", "성수2가1동", "성수2가3동", "왕십리·도선동", "왕십리2동"],
        kakaoLink: "https://invite.kakao.com/tc/6yYTIR5SkZ",
        note: "성동구"
    },
    {
        name: "중성동 을",
        dongs: ["소공동", "회현동", "명동", "필동", "장충동", "광희동", "을지로동", "신당동", "다산동", "약수동", "청구동", "동화동", "황학동", "중림동", "금호1가동", "금호2·3가동", "금호4가동", "옥수동"],
        kakaoLink: "https://invite.kakao.com/tc/Wl4H4R4eAX",
        note: "중구 전 지역 + 성동구 일부"
    },
    {
        name: "종로",
        dongs: ["청운효자동", "사직동", "삼청동", "부암동", "평창동", "무악동", "교남동", "가회동", "종로1·2·3·4가동", "종로5·6가동", "이화동", "혜화동", "창신1동", "창신2동", "창신3동", "숭인1동", "숭인2동"],
        kakaoLink: "https://invite.kakao.com/tc/wC6aK7wKad"
    }
];

async function seedChapters() {
    try {
        await connectDB();
        console.log('🔌 데이터베이스 연결됨');

        // 기존 서울 지역구 데이터 삭제
        const deleteResult = await Chapter.deleteMany({ province: 'seoul' });
        console.log(`🗑️ 기존 서울 지역구 ${deleteResult.deletedCount}개 삭제됨`);

        // 새 데이터 삽입
        const chaptersWithProvince = seoulChapters.map((chapter, index) => ({
            ...chapter,
            province: 'seoul',
            order: index,
            chairmanName: chapter.chairmanName || null,
            chairmanThreads: null,
            chairmanYoutube: null
        }));

        const insertResult = await Chapter.insertMany(chaptersWithProvince);
        console.log(`✅ 서울 지역구 ${insertResult.length}개 삽입됨`);

        // 결과 확인
        const count = await Chapter.countDocuments({ province: 'seoul' });
        console.log(`📊 총 서울 지역구 수: ${count}`);

        // 강남 병 (한성학 위원장) 확인
        const gangnamByung = await Chapter.findOne({ name: '강남 병' });
        if (gangnamByung) {
            console.log(`✅ 강남 병 당협위원장: ${gangnamByung.chairmanName || '공석'}`);
        }

        console.log('\n🎉 초기 데이터 삽입 완료!');
        process.exit(0);
    } catch (error) {
        console.error('❌ 오류 발생:', error);
        process.exit(1);
    }
}

seedChapters();
