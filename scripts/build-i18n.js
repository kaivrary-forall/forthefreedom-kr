#!/usr/bin/env node
/**
 * build-i18n.js - 다국어 HTML 빌드 스크립트
 * 
 * 사용법: node scripts/build-i18n.js
 * 
 * 템플릿 파일의 {{key}} 플레이스홀더를 CSV 번역값으로 치환하여
 * 각 언어별 HTML 파일을 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// 설정
const CONFIG = {
    localesDir: path.join(__dirname, '../locales'),
    templatesDir: path.join(__dirname, '../templates'),
    outputDir: path.join(__dirname, '..'),
    languages: ['ko', 'en'],
    defaultLang: 'ko'
};

/**
 * CSV 파일 파싱
 */
function parseCSV(csvText) {
    const result = {};
    const lines = csvText.split('\n');
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 빈 줄 또는 주석 스킵
        if (!line || line.startsWith('#')) continue;
        
        // CSV 파싱
        let key, value;
        
        // 따옴표로 감싼 값 처리
        const match = line.match(/^([^,]+),["']?(.+?)["']?$/);
        if (match) {
            key = match[1].trim();
            value = match[2].trim().replace(/^["']|["']$/g, '');
        } else {
            const commaIndex = line.indexOf(',');
            if (commaIndex > 0) {
                key = line.substring(0, commaIndex).trim();
                value = line.substring(commaIndex + 1).trim();
            }
        }
        
        if (key && value) {
            result[key] = value;
        }
    }
    
    return result;
}

/**
 * 번역 파일 로드
 */
function loadTranslations(lang) {
    const filePath = path.join(CONFIG.localesDir, `${lang}.csv`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 번역 파일 없음: ${filePath}`);
        return {};
    }
    
    const csvText = fs.readFileSync(filePath, 'utf-8');
    return parseCSV(csvText);
}

/**
 * 템플릿의 플레이스홀더를 번역값으로 치환
 */
function applyTranslations(template, translations, fallbackTranslations = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (translations[key]) {
            return translations[key];
        }
        if (fallbackTranslations[key]) {
            console.warn(`  ⚠️ Fallback 사용: ${key}`);
            return fallbackTranslations[key];
        }
        console.warn(`  ⚠️ 번역 키 없음: ${key}`);
        return match; // 원본 유지
    });
}

/**
 * 경로 수정 (영어 버전용)
 */
function adjustPathsForEnglish(html) {
    // 이미지, CSS, JS 경로에 ../ 추가
    let result = html;
    
    // src="images/ → src="../images/
    result = result.replace(/src="images\//g, 'src="../images/');
    result = result.replace(/href="images\//g, 'href="../images/');
    
    // src="/images/ → src="../images/
    result = result.replace(/src="\/images\//g, 'src="../images/');
    result = result.replace(/href="\/images\//g, 'href="../images/');
    
    // 스크립트/스타일 경로
    result = result.replace(/href="\/style\.css"/g, 'href="../style.css"');
    result = result.replace(/href="style\.css"/g, 'href="../style.css"');
    result = result.replace(/src="\/analytics\.js"/g, 'src="../analytics.js"');
    result = result.replace(/src="analytics\.js"/g, 'src="../analytics.js"');
    result = result.replace(/src="nav\.js"/g, 'src="../nav.js"');
    result = result.replace(/src="footer\.js"/g, 'src="../footer.js"');
    result = result.replace(/src="script\.js"/g, 'src="../script.js"');
    result = result.replace(/src="config\.js"/g, 'src="../config.js"');
    result = result.replace(/src="i18n\.js"/g, 'src="../i18n.js"');
    
    // 페이지 링크 (about.html → ../about.html)
    result = result.replace(/href="about\.html"/g, 'href="../about.html"');
    result = result.replace(/href="news\.html"/g, 'href="../news.html"');
    result = result.replace(/href="join\.html"/g, 'href="../join.html"');
    result = result.replace(/href="support\.html"/g, 'href="../support.html"');
    result = result.replace(/href="members\.html"/g, 'href="../members.html"');
    result = result.replace(/href="local-chapters\.html"/g, 'href="../local-chapters.html"');
    result = result.replace(/href="resources\.html"/g, 'href="../resources.html"');
    result = result.replace(/href="board\.html"/g, 'href="../board.html"');
    result = result.replace(/href="login\.html"/g, 'href="../login.html"');
    
    // 하위 폴더 링크
    result = result.replace(/href="about\//g, 'href="../about/');
    result = result.replace(/href="news\//g, 'href="../news/');
    result = result.replace(/href="members\//g, 'href="../members/');
    result = result.replace(/href="resources\//g, 'href="../resources/');
    result = result.replace(/href="committees\//g, 'href="../committees/');
    
    return result;
}

/**
 * 단일 템플릿 파일 빌드
 */
function buildTemplate(templateFile, translations, lang) {
    const templatePath = path.join(CONFIG.templatesDir, templateFile);
    
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ 템플릿 파일 없음: ${templatePath}`);
        return false;
    }
    
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // 기본 언어(한국어) 번역을 fallback으로 로드
    const fallback = lang !== CONFIG.defaultLang 
        ? loadTranslations(CONFIG.defaultLang) 
        : {};
    
    // 번역 적용
    let output = applyTranslations(template, translations, fallback);
    
    // 영어 버전은 경로 수정
    if (lang === 'en') {
        output = adjustPathsForEnglish(output);
    }
    
    // 출력 경로 결정
    let outputPath;
    if (lang === CONFIG.defaultLang) {
        outputPath = path.join(CONFIG.outputDir, templateFile);
    } else {
        const langDir = path.join(CONFIG.outputDir, lang);
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }
        outputPath = path.join(langDir, templateFile);
    }
    
    // 파일 저장
    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`  ✅ ${outputPath}`);
    
    return true;
}

/**
 * 모든 템플릿 빌드
 */
function buildAll() {
    console.log('🔨 다국어 빌드 시작...\n');
    
    // 템플릿 파일 목록
    const templates = fs.readdirSync(CONFIG.templatesDir)
        .filter(f => f.endsWith('.html'));
    
    if (templates.length === 0) {
        console.error('❌ 템플릿 파일이 없습니다. templates/ 폴더를 확인하세요.');
        return;
    }
    
    console.log(`📄 템플릿 파일: ${templates.join(', ')}\n`);
    
    // 각 언어별로 빌드
    for (const lang of CONFIG.languages) {
        console.log(`\n🌐 [${lang.toUpperCase()}] 빌드 중...`);
        
        const translations = loadTranslations(lang);
        const keyCount = Object.keys(translations).length;
        console.log(`  📖 번역 키 ${keyCount}개 로드됨`);
        
        for (const templateFile of templates) {
            buildTemplate(templateFile, translations, lang);
        }
    }
    
    console.log('\n✨ 빌드 완료!\n');
}

// 실행
buildAll();
