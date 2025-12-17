# 다국어 빌드 시스템 사용 가이드

## 개요

CSV 파일로 번역을 관리하고, 빌드 스크립트로 각 언어별 HTML 파일을 자동 생성하는 시스템입니다.

## 폴더 구조

```
forthefreedom-kr-main/
├── templates/           # 템플릿 파일 (플레이스홀더 포함)
│   └── index.html
├── locales/             # 번역 CSV 파일
│   ├── ko.csv          # 한국어
│   └── en.csv          # 영어
├── scripts/
│   └── build-i18n.js   # 빌드 스크립트
├── index.html          # [자동생성] 한국어 버전
└── en/
    └── index.html      # [자동생성] 영어 버전
```

## 사용 방법

### 1. 번역 수정하기

`locales/ko.csv` 또는 `locales/en.csv` 파일을 편집합니다.

```csv
key,value
site_title,자유와혁신
policy1_title,정의, 공정, 희망을 추구하는 가치 정당
```

### 2. HTML 빌드하기

```bash
node scripts/build-i18n.js
```

결과:
- `index.html` - 한국어 버전 생성
- `en/index.html` - 영어 버전 생성

### 3. 배포하기

```bash
git add .
git commit -m "Update translations"
git push
```

## 템플릿 문법

템플릿 파일에서 `{{key}}` 형식으로 플레이스홀더를 사용합니다.

```html
<title>{{site_title}}</title>
<h1>{{greeting_title}}</h1>
<p>{{policy1_desc}}</p>
```

## 새 페이지 추가하기

1. `templates/` 폴더에 새 템플릿 파일 추가
2. CSV 파일에 해당 키 추가
3. 빌드 스크립트 실행

## 새 언어 추가하기

1. `locales/` 폴더에 새 CSV 파일 생성 (예: `locales/ja.csv`)
2. `scripts/build-i18n.js` 에서 languages 배열에 추가:
   ```javascript
   languages: ['ko', 'en', 'ja'],
   ```
3. 빌드 스크립트 실행

## URL 구조

| 언어 | URL |
|------|-----|
| 한국어 (기본) | `forthefreedom.kr/index.html` |
| 영어 | `forthefreedom.kr/en/index.html` |

## 헤더 언어 전환 버튼

nav.js에 KO | EN 버튼이 추가되어 있습니다.
- 데스크톱: 오른쪽 상단
- 모바일: 햄버거 메뉴 옆

## 주의사항

1. **템플릿 파일 직접 수정 금지**: `templates/` 폴더의 파일만 수정
2. **빌드 후 배포**: 번역 수정 후 반드시 빌드 스크립트 실행
3. **CSV 형식**: 쉼표(,)가 포함된 값은 따옴표로 감싸기

## 문제 해결

### 번역이 적용되지 않음
- CSV 파일의 key 철자 확인
- 빌드 스크립트 재실행

### 영어 페이지에서 이미지 안 보임
- 빌드 스크립트가 자동으로 경로를 `../images/`로 변환합니다
- 수동으로 경로 수정하지 마세요

---

버전: 1.0
최종 업데이트: 2025-12-17
