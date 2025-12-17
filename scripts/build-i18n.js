const fs = require('fs');
const path = require('path');

// 설정
const TEMPLATES_DIR = './templates';
const LOCALES_DIR = './locales';
const OUTPUT_DIR = '.';
const LANGUAGES = [
    { code: 'ko', dir: '', default: true },
    { code: 'en', dir: 'en' }
];

// CSV 파싱
function parseCSV(content) {
    const translations = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        const firstComma = trimmed.indexOf(',');
        if (firstComma === -1) continue;
        
        const key = trimmed.substring(0, firstComma).trim();
        let value = trimmed.substring(firstComma + 1).trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
        }
        
        translations[key] = value;
    }
    return translations;
}

// 템플릿에 번역 적용
function applyTranslations(template, translations, defaultTranslations) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return translations[key] || defaultTranslations[key] || match;
    });
}

// 경로 조정 (영어 버전용)
function adjustPathsForEnglish(html, depth = 0) {
    const prefix = depth > 0 ? '../'.repeat(depth + 1) : '../';
    
    // 이미지, CSS, JS 경로 조정
    html = html.replace(/src="images\//g, `src="${prefix}images/`);
    html = html.replace(/href="images\//g, `href="${prefix}images/`);
    html = html.replace(/src="\.\.\/images\//g, `src="${prefix}images/`);
    html = html.replace(/href="\.\.\/images\//g, `href="${prefix}images/`);
    html = html.replace(/href="style\.css"/g, `href="${prefix}style.css"`);
    html = html.replace(/href="\.\.\/style\.css"/g, `href="${prefix}style.css"`);
    html = html.replace(/src="nav\.js"/g, `src="${prefix}nav.js"`);
    html = html.replace(/src="\.\.\/nav\.js"/g, `src="${prefix}nav.js"`);
    html = html.replace(/src="footer\.js"/g, `src="${prefix}footer.js"`);
    html = html.replace(/src="\.\.\/footer\.js"/g, `src="${prefix}footer.js"`);
    html = html.replace(/src="\/nav\.js"/g, `src="${prefix}nav.js"`);
    html = html.replace(/src="\/footer\.js"/g, `src="${prefix}footer.js"`);
    html = html.replace(/href="\/style\.css"/g, `href="${prefix}style.css"`);
    html = html.replace(/src="\/config\.js"/g, `src="${prefix}config.js"`);
    html = html.replace(/src="\/analytics\.js"/g, `src="${prefix}analytics.js"`);
    
    return html;
}

// 재귀적으로 템플릿 파일 찾기
function findTemplates(dir, baseDir = dir) {
    const templates = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            templates.push(...findTemplates(fullPath, baseDir));
        } else if (item.endsWith('.html')) {
            const relativePath = path.relative(baseDir, fullPath);
            templates.push(relativePath);
        }
    }
    return templates;
}

// 메인
console.log('🔨 다국어 빌드 시작...\n');

// 템플릿 파일 찾기
const templateFiles = findTemplates(TEMPLATES_DIR);
console.log(`📄 템플릿 파일: ${templateFiles.join(', ')}\n`);

// 기본 언어 번역 로드
const defaultLang = LANGUAGES.find(l => l.default);
const defaultTranslations = parseCSV(
    fs.readFileSync(path.join(LOCALES_DIR, `${defaultLang.code}.csv`), 'utf-8')
);

// 각 언어별 빌드
for (const lang of LANGUAGES) {
    console.log(`\n🌐 [${lang.code.toUpperCase()}] 빌드 중...`);
    
    const translations = parseCSV(
        fs.readFileSync(path.join(LOCALES_DIR, `${lang.code}.csv`), 'utf-8')
    );
    console.log(`  📖 번역 키 ${Object.keys(translations).length}개 로드됨`);
    
    for (const templateFile of templateFiles) {
        const templatePath = path.join(TEMPLATES_DIR, templateFile);
        let html = fs.readFileSync(templatePath, 'utf-8');
        
        // 번역 적용
        html = applyTranslations(html, translations, defaultTranslations);
        
        // 경로 깊이 계산
        const depth = templateFile.split('/').length - 1;
        
        // 영어 버전 경로 조정
        if (lang.dir) {
            html = adjustPathsForEnglish(html, depth);
        }
        
        // 출력 경로 결정
        const outputDir = lang.dir 
            ? path.join(OUTPUT_DIR, lang.dir, path.dirname(templateFile))
            : path.join(OUTPUT_DIR, path.dirname(templateFile));
        
        // 디렉토리 생성
        fs.mkdirSync(outputDir, { recursive: true });
        
        const outputPath = path.join(
            lang.dir ? path.join(OUTPUT_DIR, lang.dir) : OUTPUT_DIR,
            templateFile
        );
        
        fs.writeFileSync(outputPath, html);
        console.log(`  ✅ ${outputPath}`);
    }
}

console.log('\n✨ 빌드 완료!\n');
