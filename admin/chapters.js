const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');

// ============================================
// GET /api/chapters - 모든 당협 조회
// ============================================
router.get('/', async (req, res) => {
  try {
    const { province = '서울특별시' } = req.query;
    
    const chapters = await Chapter.find({ province, isActive: true })
      .sort({ order: 1, name: 1 });
    
    res.json(chapters);
  } catch (error) {
    console.error('당협 조회 오류:', error);
    res.status(500).json({ error: '당협 목록을 불러오는데 실패했습니다.' });
  }
});

// ============================================
// GET /api/chapters/:id - 특정 당협 조회
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: '당협을 찾을 수 없습니다.' });
    }
    
    res.json(chapter);
  } catch (error) {
    console.error('당협 조회 오류:', error);
    res.status(500).json({ error: '당협 정보를 불러오는데 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters - 새 당협 생성
// ============================================
router.post('/', async (req, res) => {
  try {
    const {
      province = '서울특별시',
      districtName,
      districtSuffix,
      chairmanSurname,
      chairmanGivenName,
      chairmanPhone,
      chairmanEmail,
      dongsRaw
    } = req.body;
    
    // 마지막 순서 가져오기
    const lastChapter = await Chapter.findOne({ province })
      .sort({ order: -1 });
    const newOrder = lastChapter ? lastChapter.order + 1 : 0;
    
    const chapter = new Chapter({
      province,
      districtName,
      districtSuffix: districtSuffix || null,
      chairmanSurname: chairmanSurname || null,
      chairmanGivenName: chairmanGivenName || null,
      chairmanPhone: chairmanPhone || null,
      chairmanEmail: chairmanEmail || null,
      dongsRaw: dongsRaw || null,
      order: newOrder
    });
    
    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    console.error('당협 생성 오류:', error);
    res.status(500).json({ error: '당협 생성에 실패했습니다.' });
  }
});

// ============================================
// PUT /api/chapters/:id - 당협 수정
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const {
      districtName,
      districtSuffix,
      chairmanSurname,
      chairmanGivenName,
      chairmanPhone,
      chairmanEmail,
      dongsRaw
    } = req.body;
    
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: '당협을 찾을 수 없습니다.' });
    }
    
    // 필드 업데이트
    if (districtName !== undefined) chapter.districtName = districtName;
    if (districtSuffix !== undefined) chapter.districtSuffix = districtSuffix || null;
    if (chairmanSurname !== undefined) chapter.chairmanSurname = chairmanSurname || null;
    if (chairmanGivenName !== undefined) chapter.chairmanGivenName = chairmanGivenName || null;
    if (chairmanPhone !== undefined) chapter.chairmanPhone = chairmanPhone || null;
    if (chairmanEmail !== undefined) chapter.chairmanEmail = chairmanEmail || null;
    if (dongsRaw !== undefined) chapter.dongsRaw = dongsRaw || null;
    
    await chapter.save();
    res.json(chapter);
  } catch (error) {
    console.error('당협 수정 오류:', error);
    res.status(500).json({ error: '당협 수정에 실패했습니다.' });
  }
});

// ============================================
// DELETE /api/chapters/:id - 당협 삭제
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: '당협을 찾을 수 없습니다.' });
    }
    
    res.json({ message: '당협이 삭제되었습니다.', chapter });
  } catch (error) {
    console.error('당협 삭제 오류:', error);
    res.status(500).json({ error: '당협 삭제에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/:id/move - 순서 변경 (위/아래)
// ============================================
router.post('/:id/move', async (req, res) => {
  try {
    const { direction } = req.body; // 'up' or 'down'
    const chapter = await Chapter.findById(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ error: '당협을 찾을 수 없습니다.' });
    }
    
    const allChapters = await Chapter.find({ 
      province: chapter.province, 
      isActive: true 
    }).sort({ order: 1 });
    
    const currentIndex = allChapters.findIndex(c => c._id.toString() === chapter._id.toString());
    
    if (direction === 'up' && currentIndex > 0) {
      // 위로 이동
      const targetChapter = allChapters[currentIndex - 1];
      const tempOrder = chapter.order;
      chapter.order = targetChapter.order;
      targetChapter.order = tempOrder;
      await chapter.save();
      await targetChapter.save();
    } else if (direction === 'down' && currentIndex < allChapters.length - 1) {
      // 아래로 이동
      const targetChapter = allChapters[currentIndex + 1];
      const tempOrder = chapter.order;
      chapter.order = targetChapter.order;
      targetChapter.order = tempOrder;
      await chapter.save();
      await targetChapter.save();
    }
    
    // 업데이트된 목록 반환
    const updatedChapters = await Chapter.find({ 
      province: chapter.province, 
      isActive: true 
    }).sort({ order: 1 });
    
    res.json(updatedChapters);
  } catch (error) {
    console.error('순서 변경 오류:', error);
    res.status(500).json({ error: '순서 변경에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/reorder - 드래그 앤 드롭 순서 변경
// ============================================
router.post('/reorder', async (req, res) => {
  try {
    const { orderedIds } = req.body; // ['id1', 'id2', 'id3', ...]
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: '잘못된 요청입니다.' });
    }
    
    // 각 ID에 새 순서 할당
    const updatePromises = orderedIds.map((id, index) => 
      Chapter.findByIdAndUpdate(id, { order: index })
    );
    
    await Promise.all(updatePromises);
    
    // 업데이트된 목록 반환
    const chapters = await Chapter.find({ isActive: true }).sort({ order: 1 });
    res.json(chapters);
  } catch (error) {
    console.error('순서 재정렬 오류:', error);
    res.status(500).json({ error: '순서 재정렬에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/migrate - 기존 데이터 마이그레이션
// ============================================
router.post('/migrate', async (req, res) => {
  try {
    const chapters = await Chapter.find({});
    let migratedCount = 0;
    
    for (const chapter of chapters) {
      let needsSave = false;
      
      // name이 있고 districtName이 없으면 분리
      if (chapter.name && !chapter.districtName) {
        const suffixes = ['갑', '을', '병', '정', '무'];
        const lastChar = chapter.name.slice(-1);
        
        if (suffixes.includes(lastChar)) {
          chapter.districtName = chapter.name.slice(0, -1);
          chapter.districtSuffix = lastChar;
        } else {
          chapter.districtName = chapter.name;
          chapter.districtSuffix = null;
        }
        needsSave = true;
      }
      
      // chairmanName이 있고 chairmanSurname이 없으면 분리
      if (chapter.chairmanName && !chapter.chairmanSurname) {
        // 한국 성씨는 보통 1글자 (복성 제외)
        const name = chapter.chairmanName;
        if (name.length >= 2) {
          // 복성 체크 (남궁, 황보, 제갈 등)
          const doubleSurnames = ['남궁', '황보', '제갈', '선우', '독고', '사공', '동방'];
          const firstTwo = name.slice(0, 2);
          
          if (doubleSurnames.includes(firstTwo) && name.length > 2) {
            chapter.chairmanSurname = firstTwo;
            chapter.chairmanGivenName = name.slice(2);
          } else {
            chapter.chairmanSurname = name.slice(0, 1);
            chapter.chairmanGivenName = name.slice(1);
          }
          needsSave = true;
        }
      }
      
      if (needsSave) {
        await chapter.save();
        migratedCount++;
      }
    }
    
    res.json({ 
      message: `마이그레이션 완료: ${migratedCount}개 당협 업데이트됨`,
      migratedCount,
      totalCount: chapters.length
    });
  } catch (error) {
    console.error('마이그레이션 오류:', error);
    res.status(500).json({ error: '마이그레이션에 실패했습니다.' });
  }
});

// ============================================
// POST /api/chapters/seed - 서울 48개 지역구 시드 데이터 (22대 국회 기준)
// ============================================
router.post('/seed', async (req, res) => {
  try {
    // 기존 서울 데이터 확인
    const existingCount = await Chapter.countDocuments({ province: '서울특별시' });
    
    if (existingCount > 0) {
      return res.status(400).json({ 
        error: '이미 서울특별시 데이터가 존재합니다.',
        existingCount 
      });
    }
    
    // 서울 48개 지역구 데이터 (22대 국회 기준)
    const seoulDistricts = [
      { districtName: '종로', districtSuffix: null, dongsRaw: '청운효자동#사직동#삼청동#부암동#평창동#무악동#교남동#가회동#종로1·2·3·4가동#종로5·6가동#이화동#혜화동#창신1동#창신2동#창신3동#숭인1동#숭인2동' },
      { districtName: '중구성동구', districtSuffix: '갑', dongsRaw: '소공동#회현동#명동#필동#장충동#광희동#을지로동#신당동#다산동#약수동#청구동#동화동#황학동#중림동#왕십리2동#왕십리도선동#마장동#사근동#행당1동#행당2동#응봉동' },
      { districtName: '중구성동구', districtSuffix: '을', dongsRaw: '금호1가동#금호2·3가동#금호4가동#옥수동#성수1가1동#성수1가2동#성수2가1동#성수2가3동#송정동#용답동' },
      { districtName: '용산', districtSuffix: null, dongsRaw: '후암동#용산2가동#남영동#청파동#원효로1동#원효로2동#효창동#용문동#한강로동#이촌1동#이촌2동#이태원1동#이태원2동#한남동#서빙고동#보광동' },
      { districtName: '광진', districtSuffix: '갑', dongsRaw: '중곡1동#중곡2동#중곡3동#중곡4동#능동#구의1동#구의2동#구의3동#광장동' },
      { districtName: '광진', districtSuffix: '을', dongsRaw: '자양1동#자양2동#자양3동#자양4동#화양동#군자동' },
      { districtName: '동대문', districtSuffix: '갑', dongsRaw: '용신동#제기동#전농1동#전농2동#답십리1동#답십리2동#장안1동#장안2동' },
      { districtName: '동대문', districtSuffix: '을', dongsRaw: '청량리동#회기동#휘경1동#휘경2동#이문1동#이문2동' },
      { districtName: '중랑', districtSuffix: '갑', dongsRaw: '면목본동#면목2동#면목3·8동#면목4동#면목5동#면목7동#상봉1동#상봉2동' },
      { districtName: '중랑', districtSuffix: '을', dongsRaw: '중화1동#중화2동#묵1동#묵2동#망우본동#망우3동#신내1동#신내2동' },
      { districtName: '성북', districtSuffix: '갑', dongsRaw: '성북동#삼선동#동선동#돈암1동#돈암2동#안암동#보문동#정릉1동#정릉2동#정릉3동#정릉4동' },
      { districtName: '성북', districtSuffix: '을', dongsRaw: '길음1동#길음2동#종암동#월곡1동#월곡2동#장위1동#장위2동#장위3동#석관동' },
      { districtName: '강북', districtSuffix: '갑', dongsRaw: '삼양동#미아동#송중동#송천동#삼각산동' },
      { districtName: '강북', districtSuffix: '을', dongsRaw: '번1동#번2동#번3동#수유1동#수유2동#수유3동#우이동#인수동' },
      { districtName: '도봉', districtSuffix: '갑', dongsRaw: '쌍문1동#쌍문2동#쌍문3동#쌍문4동#방학1동#방학2동#방학3동' },
      { districtName: '도봉', districtSuffix: '을', dongsRaw: '창1동#창2동#창3동#창4동#창5동#도봉1동#도봉2동' },
      { districtName: '노원', districtSuffix: '갑', dongsRaw: '월계1동#월계2동#월계3동#공릉1동#공릉2동#하계1동#하계2동' },
      { districtName: '노원', districtSuffix: '을', dongsRaw: '중계본동#중계1동#중계2·3동#중계4동#상계1동#상계2동' },
      { districtName: '노원', districtSuffix: '병', dongsRaw: '상계3·4동#상계5동#상계6·7동#상계8동#상계9동#상계10동' },
      { districtName: '은평', districtSuffix: '갑', dongsRaw: '녹번동#불광1동#불광2동#갈현1동#갈현2동#구산동#대조동#응암1동' },
      { districtName: '은평', districtSuffix: '을', dongsRaw: '응암2동#응암3동#역촌동#신사1동#신사2동#증산동#수색동#진관동' },
      { districtName: '서대문', districtSuffix: '갑', dongsRaw: '충현동#천연동#북아현동#신촌동#연희동' },
      { districtName: '서대문', districtSuffix: '을', dongsRaw: '홍제1동#홍제2동#홍제3동#홍은1동#홍은2동#남가좌1동#남가좌2동#북가좌1동#북가좌2동' },
      { districtName: '마포', districtSuffix: '갑', dongsRaw: '아현동#공덕동#도화동#용강동#대흥동#염리동#신수동#서강동' },
      { districtName: '마포', districtSuffix: '을', dongsRaw: '서교동#합정동#망원1동#망원2동#연남동#성산1동#성산2동#상암동' },
      { districtName: '양천', districtSuffix: '갑', dongsRaw: '목1동#목2동#목3동#목4동#목5동#신정1동#신정2동#신정3동#신정4동' },
      { districtName: '양천', districtSuffix: '을', dongsRaw: '신월1동#신월2동#신월3동#신월4동#신월5동#신월6동#신월7동#신정6동#신정7동' },
      { districtName: '강서', districtSuffix: '갑', dongsRaw: '염창동#등촌1동#등촌2동#등촌3동#화곡본동#화곡1동' },
      { districtName: '강서', districtSuffix: '을', dongsRaw: '화곡2동#화곡3동#화곡4동#화곡6동#화곡8동#우장산동' },
      { districtName: '강서', districtSuffix: '병', dongsRaw: '발산1동#공항동#방화1동#방화2동#방화3동' },
      { districtName: '구로', districtSuffix: '갑', dongsRaw: '신도림동#구로1동#구로2동#구로3동#구로4동#구로5동#가리봉동' },
      { districtName: '구로', districtSuffix: '을', dongsRaw: '고척1동#고척2동#개봉1동#개봉2동#개봉3동#오류1동#오류2동#항동#수궁동' },
      { districtName: '금천', districtSuffix: null, dongsRaw: '가산동#독산1동#독산2동#독산3동#독산4동#시흥1동#시흥2동#시흥3동#시흥4동#시흥5동' },
      { districtName: '영등포', districtSuffix: '갑', dongsRaw: '영등포본동#영등포동#여의동#당산1동#당산2동#도림동#문래동#양평1동#양평2동' },
      { districtName: '영등포', districtSuffix: '을', dongsRaw: '신길1동#신길3동#신길4동#신길5동#신길6동#신길7동#대림1동#대림2동#대림3동' },
      { districtName: '동작', districtSuffix: '갑', dongsRaw: '노량진1동#노량진2동#상도1동#상도2동#상도3동#상도4동#흑석동' },
      { districtName: '동작', districtSuffix: '을', dongsRaw: '사당1동#사당2동#사당3동#사당4동#사당5동#대방동#신대방1동#신대방2동' },
      { districtName: '관악', districtSuffix: '갑', dongsRaw: '보라매동#청림동#행운동#낙성대동#청룡동#은천동#성현동#중앙동#인헌동#남현동' },
      { districtName: '관악', districtSuffix: '을', dongsRaw: '서원동#신원동#서림동#신사동#신림동#삼성동#난곡동#조원동#대학동#난향동#미성동' },
      { districtName: '서초', districtSuffix: '갑', dongsRaw: '서초1동#서초2동#서초3동#서초4동#잠원동#반포본동#반포1동#반포2동#반포3동#반포4동' },
      { districtName: '서초', districtSuffix: '을', dongsRaw: '방배본동#방배1동#방배2동#방배3동#방배4동#양재1동#양재2동#내곡동' },
      { districtName: '강남', districtSuffix: '갑', dongsRaw: '신사동#압구정동#청담동#삼성1동#삼성2동#대치1동#대치2동' },
      { districtName: '강남', districtSuffix: '을', dongsRaw: '대치4동#역삼1동#역삼2동#도곡1동#도곡2동' },
      { districtName: '강남', districtSuffix: '병', dongsRaw: '개포1동#개포2동#개포4동#일원본동#일원1동#일원2동#수서동#세곡동' },
      { districtName: '송파', districtSuffix: '갑', dongsRaw: '잠실본동#잠실2동#잠실3동#잠실4동#잠실6동#잠실7동#풍납1동#풍납2동' },
      { districtName: '송파', districtSuffix: '을', dongsRaw: '거여1동#거여2동#마천1동#마천2동#방이1동#방이2동#오륜동#오금동#송파1동#송파2동#석촌동#삼전동#가락본동#가락1동#가락2동#문정1동#문정2동#장지동#위례동' },
      { districtName: '강동', districtSuffix: '갑', dongsRaw: '강일동#상일동#명일1동#명일2동#고덕1동#고덕2동#암사1동#암사2동#암사3동' },
      { districtName: '강동', districtSuffix: '을', dongsRaw: '천호1동#천호2동#천호3동#성내1동#성내2동#성내3동#길동#둔촌1동#둔촌2동' }
    ];
    
    // 데이터 삽입
    const chaptersToInsert = seoulDistricts.map((district, index) => ({
      province: '서울특별시',
      ...district,
      order: index
    }));
    
    await Chapter.insertMany(chaptersToInsert);
    
    res.json({ 
      message: `서울특별시 ${chaptersToInsert.length}개 지역구 생성 완료`,
      count: chaptersToInsert.length
    });
  } catch (error) {
    console.error('시드 데이터 생성 오류:', error);
    res.status(500).json({ error: '시드 데이터 생성에 실패했습니다.' });
  }
});

module.exports = router;
