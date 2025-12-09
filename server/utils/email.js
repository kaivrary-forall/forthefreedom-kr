const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 당협위원장 지원서 이메일 발송
 */
async function sendApplicationEmail({ 
    toEmail, 
    applicantName, 
    applicantEmail, 
    applicantPhone, 
    districtName, 
    motivation,
    resumeFile,
    coverLetterFile 
}) {
    try {
        const attachments = [];
        
        if (resumeFile) {
            attachments.push({
                filename: resumeFile.originalname,
                content: resumeFile.buffer
            });
        }
        
        if (coverLetterFile) {
            attachments.push({
                filename: coverLetterFile.originalname,
                content: coverLetterFile.buffer
            });
        }

        const emailHtml = `
            <div style="font-family: 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #A50034; border-bottom: 2px solid #A50034; padding-bottom: 10px;">
                    🗳️ 당협위원장 지원서
                </h2>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; width: 30%;"><strong>지원 지역구</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${districtName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>성명</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${applicantName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>연락처</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${applicantPhone}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9;"><strong>이메일</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${applicantEmail}</td>
                    </tr>
                </table>
                
                <h3 style="color: #333; margin-top: 30px;">📝 지원 동기</h3>
                <div style="padding: 15px; background: #f9f9f9; border-radius: 8px; line-height: 1.8;">
                    ${motivation.replace(/\n/g, '<br>')}
                </div>
                
                <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 8px;">
                    <strong>📎 첨부 파일:</strong>
                    <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                        ${resumeFile ? `<li>이력서: ${resumeFile.originalname}</li>` : '<li style="color: #999;">이력서 미첨부</li>'}
                        ${coverLetterFile ? `<li>자기소개서: ${coverLetterFile.originalname}</li>` : '<li style="color: #999;">자기소개서 미첨부</li>'}
                    </ul>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                    <p>이 메일은 자유와혁신 홈페이지에서 자동 발송되었습니다.</p>
                    <p>발송 시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
                </div>
            </div>
        `;

        const result = await resend.emails.send({
            from: '자유와혁신 <noreply@freeinno.kr>',
            to: toEmail,
            subject: `[당협위원장 지원] ${districtName} - ${applicantName}`,
            html: emailHtml,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        console.log('✅ 지원서 이메일 발송 성공:', result);
        return { success: true, id: result.id };
        
    } catch (error) {
        console.error('❌ 이메일 발송 실패:', error);
        return { success: false, error: error.message };
    }
}

module.exports = { sendApplicationEmail };
