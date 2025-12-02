/**
 * 공통 파일 업로드 유틸리티
 * - 한글 파일명 깨짐 문제 해결 (latin1 → UTF-8 변환)
 * - 안전한 파일명 생성
 * - 용도별 다양한 설정 제공
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 설정
const uploadDir = '/app/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 한글 파일명 복원 함수
 * multer가 latin1으로 잘못 해석한 파일명을 UTF-8로 변환
 */
function decodeFileName(filename) {
    try {
        // latin1 → UTF-8 변환
        return Buffer.from(filename, 'latin1').toString('utf8');
    } catch (e) {
        console.warn('파일명 디코딩 실패, 원본 사용:', filename);
        return filename;
    }
}

/**
 * 안전한 파일명 생성 함수
 * - 파일시스템 금지 문자 제거
 * - 공백 → 언더스코어
 * - 유니크 접미사 추가
 */
function createSafeFilename(originalName, defaultName = 'file') {
    // 1. 한글 파일명 복원
    const decodedName = decodeFileName(originalName);
    
    // 2. 확장자 분리
    const ext = path.extname(decodedName);
    let baseName = path.basename(decodedName, ext);
    
    // 3. 안전한 문자만 남기기 (한글, 영문, 숫자, 언더스코어, 하이픈)
    baseName = baseName
        .replace(/[<>:"/\\|?*]/g, '')     // 파일시스템 금지 문자 제거
        .replace(/\s+/g, '_')              // 공백 → 언더스코어
        .replace(/^[._-]+|[._-]+$/g, '')   // 앞뒤 특수문자 제거
        .trim();
    
    // 4. 빈 이름이면 기본값 사용
    if (!baseName) {
        baseName = defaultName;
    }
    
    // 5. 유니크 접미사 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // 6. 파일명 길이 제한 (최대 100자)
    const maxLength = 100 - uniqueSuffix.toString().length - ext.length - 1;
    if (baseName.length > maxLength) {
        baseName = baseName.substring(0, maxLength);
    }
    
    return `${baseName}-${uniqueSuffix}${ext}`;
}

/**
 * 공통 스토리지 설정
 */
const createStorage = (defaultName = 'file') => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
            const safeFilename = createSafeFilename(file.originalname, defaultName);
            console.log(`📁 파일 업로드: ${file.originalname} → ${safeFilename}`);
            cb(null, safeFilename);
        }
    });
};

/**
 * 허용 MIME 타입 정의
 */
const ALLOWED_MIMES = {
    // 이미지만
    images: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ],
    // 문서 포함
    documents: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // HWP 파일의 다양한 MIME 타입
        'application/vnd.hancom.hwp',
        'application/x-hwp',
        'application/haansofthwp',
        'application/hwp',
        'text/plain'
    ],
    // 이미지 + PDF만
    imagesAndPdf: [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf'
    ],
    // 미디어 파일 (뉴미디어용)
    media: [
        // 이미지
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        // 비디오
        'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
        // 오디오
        'audio/mpeg', 'audio/wav', 'audio/mp3',
        // 문서
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.hancom.hwp', 'application/x-hwp', 'application/haansofthwp', 'application/hwp',
        'text/plain'
    ]
};

/**
 * 파일 필터 생성 함수
 */
const createFileFilter = (allowedTypes = 'documents') => {
    const mimes = ALLOWED_MIMES[allowedTypes] || ALLOWED_MIMES.documents;
    
    return function (req, file, cb) {
        // HWP 확장자 체크 (MIME 타입이 정확하지 않을 수 있음)
        const isHwpFile = file.originalname.toLowerCase().endsWith('.hwp');
        
        console.log(`📋 파일 검증: ${file.originalname}, MIME: ${file.mimetype}`);
        
        if (mimes.includes(file.mimetype) || isHwpFile) {
            cb(null, true);
        } else {
            console.log(`❌ 거부된 파일: ${file.originalname}, MIME: ${file.mimetype}`);
            cb(new Error('지원하지 않는 파일 형식입니다.'), false);
        }
    };
};

/**
 * 업로드 인스턴스 생성 함수
 * 
 * @param {Object} options - 설정 옵션
 * @param {string} options.defaultName - 기본 파일명 (예: 'notice', 'gallery')
 * @param {number} options.maxSize - 최대 파일 크기 (바이트, 기본 10MB)
 * @param {string} options.allowedTypes - 허용 파일 타입 ('images', 'documents', 'imagesAndPdf')
 */
function createUpload(options = {}) {
    const {
        defaultName = 'file',
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = 'documents'
    } = options;
    
    return multer({
        storage: createStorage(defaultName),
        limits: {
            fileSize: maxSize
        },
        fileFilter: createFileFilter(allowedTypes)
    });
}

/**
 * 미리 정의된 업로드 인스턴스들
 */
const uploads = {
    // 공지사항용 (10MB, 문서 포함)
    notice: createUpload({ defaultName: 'notice', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 활동자료용 (10MB, 문서 포함)
    activity: createUpload({ defaultName: 'activity', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 카드뉴스용 (20MB, 이미지+PDF)
    cardNews: createUpload({ defaultName: 'cardnews', maxSize: 20 * 1024 * 1024, allowedTypes: 'imagesAndPdf' }),
    
    // 포토갤러리용 (20MB, 이미지만)
    gallery: createUpload({ defaultName: 'gallery', maxSize: 20 * 1024 * 1024, allowedTypes: 'images' }),
    
    // 행사일정용 (10MB, 문서 포함)
    event: createUpload({ defaultName: 'event', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 정책자료용 (10MB, 문서 포함)
    policyMaterial: createUpload({ defaultName: 'policy', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 당헌당규용 (10MB, 문서 포함)
    partyConstitution: createUpload({ defaultName: 'constitution', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 선거자료용 (10MB, 문서 포함)
    electionMaterial: createUpload({ defaultName: 'election', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 대변인용 (10MB, 문서 포함)
    spokesperson: createUpload({ defaultName: 'spokesperson', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 정책위원회용 (10MB, 문서 포함)
    policyCommittee: createUpload({ defaultName: 'policy-committee', maxSize: 10 * 1024 * 1024, allowedTypes: 'documents' }),
    
    // 뉴미디어용 (100MB, 미디어 파일 포함)
    newMedia: createUpload({ defaultName: 'newmedia', maxSize: 100 * 1024 * 1024, allowedTypes: 'media' }),
    
    // 언론보도용 (50MB, 미디어 파일 포함)
    mediaCoverage: createUpload({ defaultName: 'media', maxSize: 50 * 1024 * 1024, allowedTypes: 'media' })
};

/**
 * 파일 정보 객체 생성 (DB 저장용)
 * originalName도 UTF-8로 디코딩해서 저장
 */
function createAttachmentInfo(file) {
    return {
        filename: file.filename,
        originalName: decodeFileName(file.originalname), // 한글 복원
        path: `/uploads/${file.filename}`,
        size: file.size,
        mimeType: file.mimetype
    };
}

/**
 * 여러 파일의 정보 객체 배열 생성
 */
function createAttachmentsInfo(files) {
    if (!files || files.length === 0) return [];
    return files.map(createAttachmentInfo);
}

module.exports = {
    uploads,
    createUpload,
    createAttachmentInfo,
    createAttachmentsInfo,
    decodeFileName,
    uploadDir
};
