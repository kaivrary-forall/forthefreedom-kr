/**
 * Cloudinary 이미지 업로드 유틸리티
 */

const cloudinary = require('cloudinary').v2;

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * 프로필 이미지 업로드
 * @param {Buffer} fileBuffer - 파일 버퍼
 * @param {string} memberId - 회원 ID (폴더 구분용)
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
async function uploadProfileImage(fileBuffer, memberId) {
  try {
    // Buffer를 base64로 변환
    const base64 = fileBuffer.toString('base64');
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
 * 갤러리 이미지 업로드 (단일)
 * @param {Buffer} fileBuffer - 파일 버퍼
 * @param {string} originalName - 원본 파일명
 * @param {string} folder - Cloudinary 폴더 (기본: freeinno/gallery)
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
async function uploadGalleryImage(fileBuffer, originalName, folder = 'freeinno/gallery') {
  try {
    // Buffer를 base64로 변환
    const base64 = fileBuffer.toString('base64');
    
    // MIME 타입 추정
    const ext = originalName.split('.').pop().toLowerCase();
    const mimeMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    const mimeType = mimeMap[ext] || 'image/jpeg';
    
    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    console.log('✅ 갤러리 이미지 업로드 성공:', result.secure_url);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ 갤러리 이미지 업로드 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 여러 갤러리 이미지 업로드
 * @param {Array<{buffer: Buffer, originalname: string}>} files - multer 파일 배열
 * @param {string} folder - Cloudinary 폴더
 * @returns {Promise<Array<{filename: string, originalName: string, path: string, url: string, publicId: string}>>}
 */
async function uploadGalleryImages(files, folder = 'freeinno/gallery') {
  const results = [];
  
  for (const file of files) {
    const result = await uploadGalleryImage(file.buffer, file.originalname, folder);
    
    if (result.success) {
      results.push({
        filename: result.publicId,
        originalName: file.originalname,
        path: result.url,  // Cloudinary URL을 path에 저장 (기존 구조 호환)
        url: result.url,
        publicId: result.publicId,
        size: file.size,
        mimeType: file.mimetype
      });
    }
  }
  
  return results;
}

/**
 * 일반 이미지 업로드 (콘텐츠용)
 * @param {Buffer} fileBuffer - 파일 버퍼
 * @param {string} originalName - 원본 파일명
 * @param {string} folder - Cloudinary 폴더
 * @returns {Promise<{success: boolean, url?: string, publicId?: string, error?: string}>}
 */
async function uploadContentImage(fileBuffer, originalName, folder = 'freeinno/content') {
  return uploadGalleryImage(fileBuffer, originalName, folder);
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
  uploadGalleryImage,
  uploadGalleryImages,
  uploadContentImage,
  deleteImage,
  cloudinary
};
