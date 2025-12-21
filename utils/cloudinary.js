/**
 * Cloudinary 이미지 업로드 유틸리티
 */

const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * 이미지 압축 (2MB 이하로)
 * @param {Buffer} fileBuffer - 원본 파일 버퍼
 * @returns {Promise<Buffer>} - 압축된 파일 버퍼
 */
async function compressImage(fileBuffer) {
  let quality = 90;
  let compressed = await sharp(fileBuffer)
    .resize(800, 800, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality })
    .toBuffer();
  
  // 2MB 이하가 될 때까지 품질 낮추기
  while (compressed.length > 2 * 1024 * 1024 && quality > 20) {
    quality -= 10;
    compressed = await sharp(fileBuffer)
      .resize(800, 800, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toBuffer();
    console.log(`📦 이미지 압축 중... 품질: ${quality}%, 크기: ${(compressed.length / 1024 / 1024).toFixed(2)}MB`);
  }
  
  console.log(`✅ 최종 이미지 크기: ${(compressed.length / 1024 / 1024).toFixed(2)}MB`);
  return compressed;
}

/**
 * 프로필 이미지 업로드
 * @param {Buffer} fileBuffer - 파일 버퍼
 * @param {string} memberId - 회원 ID (폴더 구분용)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
async function uploadProfileImage(fileBuffer, memberId) {
  try {
    // 이미지 압축
    const compressedBuffer = await compressImage(fileBuffer);
    
    // Buffer를 base64로 변환
    const base64 = compressedBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'freeinno/profiles',
      public_id: `member_${memberId}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { format: 'webp' }
      ]
    });

    console.log('✅ 프로필 이미지 업로드 성공:', result.secure_url);
    return {
      success: true,
      url: result.secure_url
    };
  } catch (error) {
    console.error('❌ 프로필 이미지 업로드 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 이미지 삭제
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<boolean>}
 */
async function deleteImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ 이미지 삭제 성공:', publicId);
    return true;
  } catch (error) {
    console.error('❌ 이미지 삭제 실패:', error);
    return false;
  }
}

module.exports = {
  uploadProfileImage,
  deleteImage,
  cloudinary
};
