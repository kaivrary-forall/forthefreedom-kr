# QR 리다이렉트 문제 해결

## 문제
`/qr/seoul-join` 접속 시 targetUrl로 안 가고 홈으로 떨어짐

## 원인
`/qr/[code]` 라우트가 없음

## 해결

### 1. 프론트엔드 (kaivrary_freeinno 레포)
`app/qr/[code]/route.ts` 파일 추가
- `dynamic = 'force-dynamic'` 캐시 금지 설정됨 ✅
- `cache: 'no-store'` fetch 캐시 금지 ✅

### 2. 백엔드 (forthefreedom-kr/server 레포)
`server/routes/qr.js`에 `/scan/:code` 라우트 추가

⚠️ **중요**: scan 라우트는 **인증 미들웨어 위에** 배치해야 함!
기존 qr.js가 이런 구조면:

```javascript
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);  // 이 아래 라우트는 전부 인증 필요

// 관리자 라우트들...
```

이 경우, scan 라우트는 **authMiddleware 위에** 추가:

```javascript
// ✅ 공개 라우트 (인증 불필요) - 먼저 선언
router.get('/scan/:code', async (req, res) => { ... });
router.get('/vcard/:code', async (req, res) => { ... });

// 그 다음 인증 미들웨어
const authMiddleware = require('../middleware/auth');
router.use(authMiddleware);

// 관리자 라우트들...
```

### 3. 배포 순서
1. **백엔드 먼저** (Railway) - scan endpoint가 있어야 프론트가 호출 가능
2. **프론트 배포** (Vercel)

### 4. 테스트
브라우저에서 직접 접속:
```
https://www.forthefreedom.kr/qr/seoul-join
```
→ GitHub 레포로 리다이렉트되면 성공
