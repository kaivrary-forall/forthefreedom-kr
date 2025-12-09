const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// ============================================
// GET /api/chapters - 지역구 목록 조회
// ============================================
router.get('/', async (req, res) => {
  try {
    const { province } = req.query;
    const filter = { isActive: true };
    
    if (province) {
      const provinceMap = {
        'seoul': '서울특별시',
        '서울': '서울특별시',
        '서울특별시': '서울특별시'
      };
      filter.province = provinceMap[province] || province;
    }
    
    const chapters = await Chapter.find(filter).sort({ order: 1 });
    
    res.json({
      success: true,
      data: chapters,
      count: chapters.length
    });
  } catch (error) {
    console.error('지역구 목록 조회 오류:', error);
    res.status(500).json({ success: false, error: '지역구 목록을 불러오는데 실패했습니다.' });
  }
});

// ============================================
// GET /api/chapters/stats - 통계
// ============================================
router.get('/stats', async (req, res) => {
  try {
    const total = await Chapter.countDocuments({ isActive: true });
    const filled = await Chapter.countDocuments({ isActive: true, chairmanName: { $ne: null, $ne: '' } });
    const vacant = total - filled;
    
    res.json({
      success: true,
      stats: { total, filled, vacant }
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({ success: false, error: '통계를 불러오는데 실패했습니다.' });
  }
});

// ============================================
// GET /api/chapters/:id - 단일 지역구 조회
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ success: false, error: '지역구를 찾을 수 없습니다.' });
    }
    res.json({ success: true, data: chapter });
  } catch (error) {
    console.error('지역구 조회 오류:', error);
    res.status(500).json({ success: false, error: '지역구를 불러오는데 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters - 지역구 생성
// ============================================
router.post('/', async (req, res) => {
  try {
    const lastChapter = await Chapter.findOne().sort({ order: -1 });
    const newOrder = lastChapter ? lastChapter.order + 1 : 0;
    
    const chapter = new Chapter({
      ...req.body,
      order: newOrder
    });
    
    await chapter.save();
    res.status(201).json({ success: true, data: chapter });
  } catch (error) {
    console.error('지역구 생성 오류:', error);
    res.status(500).json({ success: false, error: '지역구 생성에 실패했습니다.' });
  }
});

// ============================================
// PUT /api/chapters/:id - 지역구 수정
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!chapter) {
      return res.status(404).json({ success: false, error: '지역구를 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, data: chapter });
  } catch (error) {
    console.error('지역구 수정 오류:', error);
    res.status(500).json({ success: false, error: '지역구 수정에 실패했습니다.' });
  }
});

// ============================================
// DELETE /api/chapters/:id - 지역구 삭제
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ success: false, error: '지역구를 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, message: '지역구가 삭제되었습니다.' });
  } catch (error) {
    console.error('지역구 삭제 오류:', error);
    res.status(500).json({ success: false, error: '지역구 삭제에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/:id/move - 순서 이동 (위/아래)
// ============================================
router.post('/:id/move', async (req, res) => {
  try {
    const { direction } = req.body;
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ success: false, error: '지역구를 찾을 수 없습니다.' });
    }
    
    const swapOrder = direction === 'up' ? chapter.order - 1 : chapter.order + 1;
    const swapChapter = await Chapter.findOne({ order: swapOrder, isActive: true });
    
    if (swapChapter) {
      const tempOrder = chapter.order;
      chapter.order = swapChapter.order;
      swapChapter.order = tempOrder;
      
      await chapter.save();
      await swapChapter.save();
    }
    
    const chapters = await Chapter.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: chapters });
  } catch (error) {
    console.error('순서 이동 오류:', error);
    res.status(500).json({ success: false, error: '순서 이동에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/reorder - 드래그앤드롭 순서 재정렬
// ============================================
router.post('/reorder', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'ids 배열이 필요합니다.' });
    }
    
    const updatePromises = ids.map((id, index) =>
      Chapter.findByIdAndUpdate(id, { order: index })
    );
    
    await Promise.all(updatePromises);
    
    const chapters = await Chapter.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: chapters });
  } catch (error) {
    console.error('순서 재정렬 오류:', error);
    res.status(500).json({ success: false, error: '순서 재정렬에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/seed - 서울 48개 지역구 시드 데이터
// ============================================
router.post('/seed', async (req, res) => {
  try {
    // 기존 서울 데이터 확인
    const existingCount = await Chapter.countDocuments({ province: '서울특별시' });
    
    if (existingCount > 0) {
      return res.status(400).json({ 
        success: false,
        error: '이미 서울특별시 데이터가 존재합니다.',
        existingCount 
      });
    }
    
    // 서울 48개 지역구 데이터 (정확한 데이터)
    const seoulDistricts = [
      { name: "강남 갑", dongsRaw: "신사동#논현1동#논현2동#압구정동#청담동#역삼1동#역삼2동", kakaoLink: "https://invite.kakao.com/tc/Q8wb5DlMvv" },
      { name: "강남 을", dongsRaw: "개포1동#개포2동#개포4동#세곡동#일원본동#일원1동#일원2동#수서동", kakaoLink: "https://invite.kakao.com/tc/S4LzmhDFK8" },
      { name: "강남 병", dongsRaw: "삼성1동#삼성2동#대치1동#대치2동#대치4동#도곡1동#도곡2동", kakaoLink: "https://invite.kakao.com/tc/x6dqGoh3rh" },
      { name: "강동 갑", dongsRaw: "암사1동#암사2동#암사3동#명일1동#명일2동#고덕1동#고덕2동#강일동#상일동", kakaoLink: "https://invite.kakao.com/tc/FcT9mRIBrN" },
      { name: "강동 을", dongsRaw: "천호1동#천호2동#천호3동#성내1동#성내2동#성내3동#둔촌1동#둔촌2동#길동", kakaoLink: "https://invite.kakao.com/tc/ssYGTEfE9Z" },
      { name: "강북 갑", dongsRaw: "번1동#번2동#우이동#인수동#수유1동#수유2동#수유3동", kakaoLink: "https://invite.kakao.com/tc/uXwwzfwwxH" },
      { name: "강북 을", dongsRaw: "번3동#삼양동#미아동#송중동#송천동#삼각산동", kakaoLink: "https://invite.kakao.com/tc/wv1NiWfyvm" },
      { name: "강서 갑", dongsRaw: "발산1동#우장산동#화곡1동#화곡2동#화곡3동#화곡8동", kakaoLink: "https://invite.kakao.com/tc/wErhlclI9J" },
      { name: "강서 을", dongsRaw: "가양1동#가양2동#등촌3동#공항동#방화1동#방화2동#방화3동", kakaoLink: "https://invite.kakao.com/tc/VYfa9v0bOv" },
      { name: "강서 병", dongsRaw: "등촌1동#등촌2동#가양3동#염창동#화곡4동#화곡6동#화곡본동", kakaoLink: "https://invite.kakao.com/tc/Gdp6xnhlj3" },
      { name: "관악 갑", dongsRaw: "보라매동#은천동#성현동#중앙동#청림동#행운동#청룡동#낙성대동#인헌동#남현동#신림동", kakaoLink: "https://invite.kakao.com/tc/N4ktmdyDsu" },
      { name: "관악 을", dongsRaw: "신사동#조원동#미성동#난곡동#난향동#서원동#신원동#서림동#삼성동#대학동", kakaoLink: "https://invite.kakao.com/tc/fcjfBmwKhU" },
      { name: "광진 갑", dongsRaw: "중곡1동#중곡2동#중곡3동#중곡4동#구의2동#군자동#광장동#능동", kakaoLink: "https://invite.kakao.com/tc/r8sPIxP2Ic" },
      { name: "광진 을", dongsRaw: "자양1동#자양2동#자양3동#자양4동#구의1동#구의3동#화양동", kakaoLink: "https://invite.kakao.com/tc/klUmEYr6R5" },
      { name: "구로 갑", dongsRaw: "개봉1동#개봉2동#개봉3동#고척1동#고척2동#오류1동#오류2동#수궁동#항동", kakaoLink: "https://invite.kakao.com/tc/Grmew30A5t" },
      { name: "구로 을", dongsRaw: "구로1동#구로2동#구로3동#구로4동#구로5동#신도림동#가리봉동", kakaoLink: "https://invite.kakao.com/tc/I726mhYDub" },
      { name: "금천", dongsRaw: "금천구 전 지역", kakaoLink: "https://invite.kakao.com/tc/w16GSt7hM3" },
      { name: "노원 갑", dongsRaw: "월계1동#월계2동#월계3동#공릉1동#공릉2동#하계1동#하계2동#중계본동#중계2·3동", kakaoLink: "https://invite.kakao.com/tc/DkaUzITz8M" },
      { name: "노원 을", dongsRaw: "중계1동#중계4동#상계1동#상계2동#상계3·4동#상계5동#상계6·7동#상계8동#상계9동#상계10동", kakaoLink: "https://invite.kakao.com/tc/WKKZQElR61" },
      { name: "도봉 갑", dongsRaw: "쌍문1동#쌍문3동#창1동#창2동#창3동#창4동#창5동", kakaoLink: "https://invite.kakao.com/tc/AHsy504VSN" },
      { name: "도봉 을", dongsRaw: "쌍문2동#쌍문4동#방학1동#방학2동#방학3동#도봉1동#도봉2동", kakaoLink: "https://invite.kakao.com/tc/YWWlpiWiyP" },
      { name: "동대문 갑", dongsRaw: "휘경1동#휘경2동#이문1동#이문2동#청량리동#용신동#제기동#회기동", kakaoLink: "https://invite.kakao.com/tc/TN2TrcPwuz" },
      { name: "동대문 을", dongsRaw: "전농1동#전농2동#장안1동#장안2동#답십리1동#답십리2동", kakaoLink: "https://invite.kakao.com/tc/TXG50mNKB5" },
      { name: "동작 갑", dongsRaw: "대방동#상도2동#상도3동#상도4동#노량진1동#노량진2동#신대방1동#신대방2동", kakaoLink: "https://invite.kakao.com/tc/0nADJCg2rZ" },
      { name: "동작 을", dongsRaw: "흑석동#상도1동#사당1동#사당2동#사당3동#사당4동#사당5동", kakaoLink: "https://invite.kakao.com/tc/GSC2GXAsje" },
      { name: "마포 갑", dongsRaw: "공덕동#아현동#도화동#용강동#대흥동#염리동#신수동", kakaoLink: "https://invite.kakao.com/tc/PqCdf56vor" },
      { name: "마포 을", dongsRaw: "서강동#서교동#합정동#망원1동#망원2동#연남동#성산1동#성산2동#상암동", kakaoLink: "https://invite.kakao.com/tc/nfAJ6PPiB8" },
      { name: "서대문 갑", dongsRaw: "홍제1동#홍제2동#북아현동#천연동#충현동#신촌동#연희동", kakaoLink: "https://invite.kakao.com/tc/06h4F8WWAo" },
      { name: "서대문 을", dongsRaw: "홍은1동#홍은2동#홍제3동#남가좌1동#남가좌2동#북가좌1동#북가좌2동", kakaoLink: "https://invite.kakao.com/tc/7nr9xEqDTL" },
      { name: "서초 갑", dongsRaw: "잠원동#반포본동#반포1동#반포2동#반포3동#반포4동#방배본동#방배1동#방배4동", kakaoLink: "https://invite.kakao.com/tc/XdLoR2RbAz" },
      { name: "서초 을", dongsRaw: "서초1동#서초2동#서초3동#서초4동#방배2동#방배3동#양재1동#양재2동#내곡동", kakaoLink: "https://invite.kakao.com/tc/EUABKmafwi" },
      { name: "성북 갑", dongsRaw: "길음1동#돈암2동#안암동#보문동#정릉1동#정릉2동#정릉3동#정릉4동#성북동#삼선동#동선동", kakaoLink: "https://invite.kakao.com/tc/O9tfteKLJH" },
      { name: "성북 을", dongsRaw: "돈암1동#길음2동#종암동#석관동#장위1동#장위2동#장위3동#월곡1동#월곡2동", kakaoLink: "https://invite.kakao.com/tc/k2oQly2OBf" },
      { name: "송파 갑", dongsRaw: "풍납1동#풍납2동#방이1동#방이2동#오륜동#송파1동#송파2동#잠실4동#잠실6동", kakaoLink: "https://invite.kakao.com/tc/IJ6cVgFYnz" },
      { name: "송파 을", dongsRaw: "석촌동#삼전동#가락1동#문정2동#잠실본동#잠실2동#잠실3동#잠실7동", kakaoLink: "https://invite.kakao.com/tc/nvfOMcNioq" },
      { name: "송파 병", dongsRaw: "거여1동#거여2동#마천1동#마천2동#오금동#가락본동#가락2동#문정1동#장지동#위례동", kakaoLink: "https://invite.kakao.com/tc/eu0aGBXRPr" },
      { name: "양천 갑", dongsRaw: "목1동#목2동#목3동#목4동#목5동#신정1동#신정2동#신정6동#신정7동", kakaoLink: "https://invite.kakao.com/tc/C7H1vPh9Pg" },
      { name: "양천 을", dongsRaw: "신월1동#신월2동#신월3동#신월4동#신월5동#신월6동#신월7동#신정3동#신정4동", kakaoLink: "https://invite.kakao.com/tc/WRQQzVfmF8" },
      { name: "영등포 갑", dongsRaw: "신길3동#당산1동#당산2동#양평1동#양평2동#문래동#영등포동#영등포본동#도림동", kakaoLink: "https://invite.kakao.com/tc/x5ceRq3oE9" },
      { name: "영등포 을", dongsRaw: "신길1동#신길4동#신길5동#신길6동#신길7동#여의동#대림1동#대림2동#대림3동", kakaoLink: "https://invite.kakao.com/tc/q4hFQbBpD9" },
      { name: "용산", dongsRaw: "용산구 전 지역", kakaoLink: "https://invite.kakao.com/tc/YcmlIpCTb6" },
      { name: "은평 갑", dongsRaw: "녹번동#역촌동#증산동#신사1동#신사2동#응암1동#응암2동#응암3동#수색동", kakaoLink: "https://invite.kakao.com/tc/n9yxNBceDv" },
      { name: "은평 을", dongsRaw: "구산동#대조동#진관동#갈현1동#갈현2동#불광1동#불광2동", kakaoLink: "https://invite.kakao.com/tc/7WeyD9KkWP" },
      { name: "종로", dongsRaw: "종로구 전 지역", kakaoLink: "https://invite.kakao.com/tc/wC6aK7wKad" },
      { name: "중랑 갑", dongsRaw: "상봉2동#망우3동#면목본동#면목2동#면목4동#면목5동#면목3·8동#면목7동", kakaoLink: "https://invite.kakao.com/tc/YMpTN9y6Yg" },
      { name: "중랑 을", dongsRaw: "상봉1동#망우본동#중화1동#중화2동#신내1동#신내2동#묵1동#묵2동", kakaoLink: "https://invite.kakao.com/tc/WKuJmQUz54" },
      { name: "중성동 갑", dongsRaw: "마장동#사근동#응봉동#송정동#용답동#행당1동#행당2동#성수1가1동#성수1가2동#성수2가1동#성수2가3동#왕십리·도선동#왕십리2동", kakaoLink: "https://invite.kakao.com/tc/6yYTIR5SkZ", note: "성동구" },
      { name: "중성동 을", dongsRaw: "중구 전 지역#금호1가동#금호2·3가동#금호4가동#옥수동", kakaoLink: "https://invite.kakao.com/tc/Wl4H4R4eAX", note: "중구 전 지역 + 성동구 일부" }
    ];
    
    // 데이터 삽입
    const chaptersToInsert = seoulDistricts.map((district, index) => ({
      province: '서울특별시',
      ...district,
      order: index
    }));
    
    await Chapter.insertMany(chaptersToInsert);
    
    res.json({ 
      success: true,
      message: `서울특별시 ${chaptersToInsert.length}개 지역구 생성 완료`,
      count: chaptersToInsert.length
    });
  } catch (error) {
    console.error('시드 데이터 생성 오류:', error);
    res.status(500).json({ success: false, error: '시드 데이터 생성에 실패했습니다.' });
  }
});

// ============================================
// DELETE /api/chapters/all - 모든 데이터 삭제 (개발용)
// ============================================
router.delete('/all', async (req, res) => {
  try {
    const result = await Chapter.deleteMany({});
    res.json({ 
      success: true, 
      message: `${result.deletedCount}개 지역구 삭제됨` 
    });
  } catch (error) {
    console.error('전체 삭제 오류:', error);
    res.status(500).json({ success: false, error: '삭제에 실패했습니다.' });
  }
});

module.exports = router;
