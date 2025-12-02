/**
 * 깨진 한글 파일명 복원 API
 * 브라우저에서 접속하면 실행됨
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// 깨진 한글 복원
function decodeFileName(filename) {
    if (!filename) return filename;
    try {
        const decoded = Buffer.from(filename, 'latin1').toString('utf8');
        if (/[가-힣]/.test(decoded)) return decoded;
        return filename;
    } catch (e) {
        return filename;
    }
}

// 깨졌는지 확인
function isBroken(filename) {
    if (!filename) return false;
    const brokenPattern = /[\x80-\xff]{2,}/;
    return brokenPattern.test(filename);
}

// 미리보기 (GET /api/fix-filenames/preview)
router.get('/preview', async (req, res) => {
    try {
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

        const results = [];

        for (const col of collections) {
            const collection = mongoose.connection.collection(col.name);
            const docs = await collection.find({}).toArray();

            for (const doc of docs) {
                const files = doc[col.field];
                if (!files || !Array.isArray(files)) continue;

                for (const file of files) {
                    if (isBroken(file.originalName)) {
                        results.push({
                            collection: col.name,
                            before: file.originalName,
                            after: decodeFileName(file.originalName)
                        });
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `${results.length}개의 깨진 파일명 발견`,
            brokenFiles: results
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 실제 수정 (POST /api/fix-filenames/run)
router.post('/run', async (req, res) => {
    try {
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
        const fixedItems = [];

        for (const col of collections) {
            const collection = mongoose.connection.collection(col.name);
            const docs = await collection.find({}).toArray();

            for (const doc of docs) {
                const files = doc[col.field];
                if (!files || !Array.isArray(files) || files.length === 0) continue;

                let needsUpdate = false;
                const updatedFiles = files.map(file => {
                    if (isBroken(file.originalName)) {
                        const fixed = decodeFileName(file.originalName);
                        fixedItems.push({
                            collection: col.name,
                            before: file.originalName,
                            after: fixed
                        });
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
                    totalFixed++;
                }
            }
        }

        res.json({
            success: true,
            message: `${totalFixed}개 문서 수정 완료`,
            fixedItems: fixedItems
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
