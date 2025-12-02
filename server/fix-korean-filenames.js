/**
 * 깨진 한글 파일명 복원 스크립트
 * latin1으로 잘못 저장된 파일명을 UTF-8로 복원
 * 
 * 실행 방법:
 * 1. Railway 콘솔에서: node fix-korean-filenames.js
 * 2. 또는 로컬에서: MONGODB_URI="your-uri" node fix-korean-filenames.js
 */

const mongoose = require('mongoose');

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI 환경변수가 필요합니다.');
    process.exit(1);
}

/**
 * 깨진 한글 파일명 복원 함수
 */
function decodeFileName(filename) {
    if (!filename) return filename;
    
    try {
        // latin1 → UTF-8 변환
        const decoded = Buffer.from(filename, 'latin1').toString('utf8');
        
        // 변환 후 한글이 포함되어 있으면 성공
        if (/[가-힣]/.test(decoded)) {
            return decoded;
        }
        // 원본이 이미 정상이면 그대로 반환
        return filename;
    } catch (e) {
        return filename;
    }
}

/**
 * 파일명이 깨졌는지 확인
 */
function isBroken(filename) {
    if (!filename) return false;
    
    // latin1로 잘못 인코딩된 한글 패턴 (예: ë³´ê³ ì„œ)
    // 0x80-0xFF 범위의 문자가 연속으로 나타나면 깨진 것
    const brokenPattern = /[\x80-\xff]{2,}/;
    return brokenPattern.test(filename);
}

/**
 * 모든 모델에서 깨진 파일명 찾아서 수정
 */
async function fixAllCollections() {
    // 첨부파일이 있는 컬렉션들
    const collections = [
        { name: 'notices', field: 'attachments' },
        { name: 'activities', field: 'attachments' },
        { name: 'cardnews', field: 'images' },
        { name: 'galleries', field: 'images' },
        { name: 'events', field: 'attachments' },
        { name: 'policymaterials', field: 'attachments' },
        { name: 'partyconstitutions', field: 'attachments' },
        { name: 'electionmaterials', field: 'attachments' },
        { name: 'spokespersons', field: 'attachments' },
        { name: 'policycommittees', field: 'attachments' },
        { name: 'newmedias', field: 'attachments' },
        { name: 'mediacoverages', field: 'attachments' }
    ];

    let totalFixed = 0;

    for (const col of collections) {
        console.log(`\n📂 ${col.name} 컬렉션 검사 중...`);
        
        const collection = mongoose.connection.collection(col.name);
        const docs = await collection.find({}).toArray();
        
        let fixedInCollection = 0;

        for (const doc of docs) {
            const files = doc[col.field];
            if (!files || !Array.isArray(files) || files.length === 0) continue;

            let needsUpdate = false;
            const updatedFiles = files.map(file => {
                const originalName = file.originalName;
                
                if (isBroken(originalName)) {
                    const fixed = decodeFileName(originalName);
                    console.log(`  🔧 "${originalName}" → "${fixed}"`);
                    needsUpdate = true;
                    return { ...file, originalName: fixed };
                }
                return file;
            });

            if (needsUpdate) {
                await collection.updateOne(
                    { _id: doc._id },
                    { $set: { [col.field]: updatedFiles } }
                );
                fixedInCollection++;
                totalFixed++;
            }
        }

        if (fixedInCollection > 0) {
            console.log(`  ✅ ${fixedInCollection}개 문서 수정됨`);
        } else {
            console.log(`  ✓ 깨진 파일명 없음`);
        }
    }

    return totalFixed;
}

/**
 * 미리보기 모드 (수정 안 하고 확인만)
 */
async function previewBrokenFiles() {
    const collections = [
        { name: 'notices', field: 'attachments' },
        { name: 'activities', field: 'attachments' },
        { name: 'cardnews', field: 'images' },
        { name: 'galleries', field: 'images' },
        { name: 'events', field: 'attachments' },
        { name: 'policymaterials', field: 'attachments' },
        { name: 'partyconstitutions', field: 'attachments' },
        { name: 'electionmaterials', field: 'attachments' },
        { name: 'spokespersons', field: 'attachments' },
        { name: 'policycommittees', field: 'attachments' },
        { name: 'newmedias', field: 'attachments' },
        { name: 'mediacoverages', field: 'attachments' }
    ];

    let totalBroken = 0;

    console.log('\n🔍 깨진 파일명 미리보기 (수정하지 않음)\n');

    for (const col of collections) {
        const collection = mongoose.connection.collection(col.name);
        const docs = await collection.find({}).toArray();

        for (const doc of docs) {
            const files = doc[col.field];
            if (!files || !Array.isArray(files)) continue;

            for (const file of files) {
                if (isBroken(file.originalName)) {
                    const fixed = decodeFileName(file.originalName);
                    console.log(`[${col.name}] "${file.originalName}" → "${fixed}"`);
                    totalBroken++;
                }
            }
        }
    }

    return totalBroken;
}

/**
 * 메인 실행
 */
async function main() {
    const args = process.argv.slice(2);
    const previewOnly = args.includes('--preview') || args.includes('-p');

    try {
        console.log('🔌 MongoDB 연결 중...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB 연결 성공!\n');

        if (previewOnly) {
            // 미리보기 모드
            const count = await previewBrokenFiles();
            console.log(`\n📊 총 ${count}개의 깨진 파일명 발견`);
            console.log('💡 실제 수정하려면 --preview 없이 실행하세요.');
        } else {
            // 실제 수정 모드
            console.log('⚠️  실제 수정 모드로 실행합니다...\n');
            const count = await fixAllCollections();
            console.log(`\n✅ 완료! 총 ${count}개 문서 수정됨`);
        }

    } catch (error) {
        console.error('❌ 오류 발생:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 MongoDB 연결 종료');
    }
}

main();
