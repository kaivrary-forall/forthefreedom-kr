const express = require('express');
const multer = require('multer');
const { sendApplicationEmail } = require('../utils/email');

const router = express.Router();

// 메모리 스토리지 (파일을 버퍼로 저장)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 2
    },
    fileFilter: (req, file, cb) => {
        // 허용할 파일 타입
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/hwp',
            'application/x-hwp'
        ];
        
        // 확장자로도 체크
        const allowedExtensions = ['.pdf', '.doc', '.docx', '.hwp'];
        const ext = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
        
        if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('PDF, DOC, DOCX, HWP 파일만 업로드 가능합니다.'), false);
        }
    }
});

// 시도별 이메일 매핑
const provinceEmails = {
    'seoul': 'seoul@freeinno.kr',
    // 추후 다른 시도 추가
    // 'busan': 'busan@freeinno.kr',
    // 'daegu': 'daegu@freeinno.kr',
};

// 당협위원장 지원 API
router.post('/chapter-chairman', 
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { 
                applicantName, 
                applicantEmail, 
                applicantPhone, 
                districtName,
                province,
                motivation,
                memberId
            } = req.body;

            // 필수 필드 검증
            if (!applicantName || !applicantEmail || !applicantPhone || !districtName || !motivation) {
                return res.status(400).json({
                    success: false,
                    message: '필수 정보를 모두 입력해주세요.'
                });
            }

            // 파일 검증 (최소 하나는 필수)
            const resumeFile = req.files?.resume?.[0];
            const coverLetterFile = req.files?.coverLetter?.[0];
            
            if (!resumeFile && !coverLetterFile) {
                return res.status(400).json({
                    success: false,
                    message: '이력서 또는 자기소개서를 첨부해주세요.'
                });
            }

            // 해당 시도 이메일 주소
            const toEmail = provinceEmails[province] || provinceEmails['seoul'];

            // 이메일 발송
            const emailResult = await sendApplicationEmail({
                toEmail,
                applicantName,
                applicantEmail,
                applicantPhone,
                districtName,
                motivation,
                resumeFile,
                coverLetterFile
            });

            if (emailResult.success) {
                console.log(`✅ 당협위원장 지원 접수: ${districtName} - ${applicantName}`);
                
                res.json({
                    success: true,
                    message: '지원서가 성공적으로 접수되었습니다.'
                });
            } else {
                throw new Error(emailResult.error);
            }

        } catch (error) {
            console.error('❌ 지원 처리 오류:', error);
            
            // Multer 에러 처리
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: '파일 크기는 10MB를 초과할 수 없습니다.'
                    });
                }
            }
            
            res.status(500).json({
                success: false,
                message: error.message || '지원 처리 중 오류가 발생했습니다.'
            });
        }
    }
);

module.exports = router;
