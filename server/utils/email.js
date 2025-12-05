/**
 * 이메일 발송 유틸리티
 * Resend API 사용
 */

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// 발신자 이메일 (도메인 인증 전에는 Resend 기본 주소 사용)
const FROM_EMAIL = process.env.SMTP_USER 
  ? `자유와혁신 <${process.env.SMTP_USER}>`
  : '자유와혁신 <onboarding@resend.dev>';

/**
 * 이메일 인증 코드 발송
 * @param {string} to - 수신자 이메일
 * @param {string} code - 6자리 인증 코드
 * @returns {Promise<boolean>}
 */
async function sendVerificationCode(to, code) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: '[자유와혁신] 이메일 인증 코드',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Malgun Gothic', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #A50034 0%, #8B002C 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 40px 30px; }
            .code-box { background: #f8f9fa; border: 2px dashed #A50034; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
            .code { font-size: 36px; font-weight: bold; color: #A50034; letter-spacing: 8px; }
            .notice { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; font-size: 14px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🗳️ 자유와혁신</h1>
            </div>
            <div class="content">
              <h2>이메일 인증 코드</h2>
              <p>안녕하세요, 자유와혁신입니다.</p>
              <p>이메일 변경을 위한 인증 코드입니다.</p>
              
              <div class="code-box">
                <p style="margin: 0 0 10px 0; color: #666;">인증 코드</p>
                <div class="code">${code}</div>
              </div>
              
              <div class="notice">
                ⚠️ 이 코드는 <strong>5분간</strong> 유효합니다.<br>
                본인이 요청하지 않은 경우 이 메일을 무시해주세요.
              </div>
            </div>
            <div class="footer">
              <p>© 자유와혁신 Freedom & Innovation</p>
              <p>이 메일은 발신 전용입니다.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ 인증 메일 발송 실패:', error);
      return false;
    }

    console.log('✅ 인증 메일 발송:', to, data.id);
    return true;
  } catch (error) {
    console.error('❌ 인증 메일 발송 오류:', error);
    return false;
  }
}

/**
 * 6자리 랜덤 인증 코드 생성
 * @returns {string}
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  sendVerificationCode,
  generateVerificationCode
};
