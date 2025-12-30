// =====================================================
// 이 코드를 server/routes/qr.js 맨 위에 추가하세요
// (인증 미들웨어 위에 배치해야 공개 접근 가능)
// =====================================================

// 공개 엔드포인트 - QR 스캔 (인증 불필요)
// GET /api/qr/scan/:code
router.get('/scan/:code', async (req, res) => {
  try {
    const { code } = req.params
    const qr = await QRCode.findOne({ code, isActive: true })
    
    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR not found' })
    }

    // 스캔 카운트 증가
    qr.scans = (qr.scans || 0) + 1
    await qr.save()

    // type에 따라 targetUrl 결정
    let targetUrl = ''
    if (qr.type === 'url') {
      targetUrl = qr.targetUrl
    } else if (qr.type === 'landing') {
      targetUrl = `https://www.forthefreedom.kr/l/${qr.landingSlug}`
    } else if (qr.type === 'vcard') {
      targetUrl = `https://forthefreedom-kr-production.up.railway.app/api/qr/vcard/${code}`
    }

    return res.json({ success: true, targetUrl, scans: qr.scans })
  } catch (error) {
    console.error('QR scan error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// vCard 다운로드 (선택)
// GET /api/qr/vcard/:code
router.get('/vcard/:code', async (req, res) => {
  try {
    const { code } = req.params
    const qr = await QRCode.findOne({ code, type: 'vcard', isActive: true })

    if (!qr || !qr.vcardData) {
      return res.status(404).json({ success: false, message: 'vCard not found' })
    }

    const v = qr.vcardData
    const vcard = `BEGIN:VCARD
VERSION:3.0
N:${v.name || ''}
FN:${v.name || ''}
ORG:${v.organization || ''}
TITLE:${v.title || ''}
TEL:${v.phone || ''}
EMAIL:${v.email || ''}
URL:${v.website || ''}
ADR:;;${v.address || ''}
NOTE:${v.note || ''}
END:VCARD`

    res.setHeader('Content-Type', 'text/vcard')
    res.setHeader('Content-Disposition', `attachment; filename="${code}.vcf"`)
    res.send(vcard)
  } catch (error) {
    console.error('vCard error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// =====================================================
// 여기 아래부터 기존 인증 필요한 관리자 라우트들
// =====================================================
