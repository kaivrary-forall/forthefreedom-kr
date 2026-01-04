'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Popup {
  _id?: string
  title: string
  contentHtml: string
  defaultTextColor: string
  bgColor: string
  bgOpacity: number
  link?: string
  linkText?: string
  isActive: boolean
  hideHours: number
  forceShowVersion: number
}

const FONT_SIZES = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '20', value: '20px' },
  { label: '24', value: '24px' },
  { label: '32', value: '32px' },
  { label: '40', value: '40px' },
  { label: '48', value: '48px' },
]

const LINE_HEIGHTS = [
  { label: '1.0', value: '1' },
  { label: '1.2', value: '1.2' },
  { label: '1.4', value: '1.4' },
  { label: '1.6', value: '1.6' },
  { label: '1.8', value: '1.8' },
  { label: '2.0', value: '2' },
]

// WYSIWYG 에디터 컴포넌트
function WysiwygEditor({ 
  value, 
  onChange, 
  isHtmlMode 
}: { 
  value: string
  onChange: (val: string) => void
  isHtmlMode: boolean 
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const [formatState, setFormatState] = useState({ bold: false, italic: false, underline: false })

  // 초기 로드 + HTML 모드 전환 시 동기화
  useEffect(() => {
    if (!isHtmlMode && editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [isHtmlMode, value])

  const syncToState = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  // selection 저장
  const saveSelection = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange()
      
      // 포맷 상태 업데이트
      setFormatState({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline')
      })
    }
  }, [])

  // selection 복구 (하이라이트 표시)
  const restoreSelection = useCallback(() => {
    if (savedRangeRef.current && editorRef.current) {
      editorRef.current.focus()
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedRangeRef.current)
      }
    }
  }, [])

  // 현재 selection을 다시 저장 + 하이라이트 유지
  const reselectAndSave = useCallback(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange()
      // 다시 선택 표시
      selection.removeAllRanges()
      selection.addRange(savedRangeRef.current)
    }
  }, [])

  // 툴바 mousedown - selection 유지 (select는 예외)
  const handleToolbarMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'SELECT' || target.tagName === 'OPTION') {
      return // select는 정상 동작하게
    }
    e.preventDefault()
  }

  // execCommand로 토글 (bold/italic/underline) + selection 유지
  const toggleFormat = (command: string) => {
    restoreSelection()
    document.execCommand(command, false)
    syncToState()
    // execCommand 후 selection 다시 저장 + 하이라이트 유지
    reselectAndSave()
    // 포맷 상태 업데이트
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline')
    })
  }

  // 폰트 크기 적용 (span wrap)
  const applyFontSize = (size: string) => {
    restoreSelection()
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    if (range.collapsed) return // 선택 없으면 무시
    
    const span = document.createElement('span')
    span.style.fontSize = size
    
    try {
      const contents = range.extractContents()
      span.appendChild(contents)
      range.insertNode(span)
      
      // 새 selection 설정
      const newRange = document.createRange()
      newRange.selectNodeContents(span)
      selection.removeAllRanges()
      selection.addRange(newRange)
      savedRangeRef.current = newRange.cloneRange()
    } catch (e) {
      console.error('폰트 크기 적용 실패:', e)
    }
    
    syncToState()
  }

  // 줄간격 적용 (블록 요소에 적용)
  const applyLineHeight = (height: string) => {
    restoreSelection()
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    
    const range = selection.getRangeAt(0)
    
    // 선택 영역의 가장 가까운 블록 요소 찾기
    let node: Node | null = range.commonAncestorContainer
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode
    }
    
    // 블록 요소 찾기 (div, p, li 등)
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        const display = window.getComputedStyle(el).display
        if (display === 'block' || display === 'list-item') {
          el.style.lineHeight = height
          syncToState()
          reselectAndSave()
          return
        }
      }
      node = node.parentNode
    }
    
    // 블록 요소를 못 찾으면 에디터 전체에 적용하거나 div로 감싸기
    if (editorRef.current && !range.collapsed) {
      const div = document.createElement('div')
      div.style.lineHeight = height
      
      try {
        const contents = range.extractContents()
        div.appendChild(contents)
        range.insertNode(div)
        
        const newRange = document.createRange()
        newRange.selectNodeContents(div)
        selection.removeAllRanges()
        selection.addRange(newRange)
        savedRangeRef.current = newRange.cloneRange()
      } catch (e) {
        console.error('줄간격 적용 실패:', e)
      }
    }
    
    syncToState()
  }

  const insertLineBreak = () => {
    restoreSelection()
    document.execCommand('insertLineBreak', false)
    syncToState()
    reselectAndSave()
  }

  // selectionchange 이벤트 리스너
  useEffect(() => {
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        saveSelection()
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [saveSelection])

  // HTML 모드
  if (isHtmlMode) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="p-2 bg-gray-100 border-b text-sm text-gray-600">
          HTML 직접 편집 모드
        </div>
        <textarea 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          rows={12}
          className="w-full px-4 py-3 font-mono text-sm focus:outline-none resize-none"
          placeholder="<div>HTML 코드를 직접 입력하세요</div>"
        />
      </div>
    )
  }

  // WYSIWYG 모드
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 툴바 - 전체에 mousedown preventDefault */}
      <div className="p-2 bg-gray-50 border-b space-y-2" onMouseDown={handleToolbarMouseDown}>
        {/* 기본 서식 (토글) + 드롭다운 */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            type="button" 
            onClick={() => toggleFormat('bold')} 
            className={`px-3 py-1.5 text-sm font-bold rounded border transition ${formatState.bold ? 'bg-primary text-white border-primary' : 'hover:bg-gray-200 border-gray-300'}`}
            title="굵게 (토글)"
          >
            B
          </button>
          <button 
            type="button" 
            onClick={() => toggleFormat('italic')} 
            className={`px-3 py-1.5 text-sm italic rounded border transition ${formatState.italic ? 'bg-primary text-white border-primary' : 'hover:bg-gray-200 border-gray-300'}`}
            title="기울임 (토글)"
          >
            I
          </button>
          <button 
            type="button" 
            onClick={() => toggleFormat('underline')} 
            className={`px-3 py-1.5 text-sm underline rounded border transition ${formatState.underline ? 'bg-primary text-white border-primary' : 'hover:bg-gray-200 border-gray-300'}`}
            title="밑줄 (토글)"
          >
            U
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <button 
            type="button" 
            onClick={insertLineBreak} 
            className="px-3 py-1.5 text-sm hover:bg-gray-200 rounded border border-gray-300" 
            title="줄바꿈"
          >
            ↵
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          {/* 폰트 크기 드롭다운 */}
          <select 
            onChange={(e) => applyFontSize(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded bg-white"
            defaultValue=""
          >
            <option value="" disabled>글자 크기</option>
            {FONT_SIZES.map((size) => (
              <option key={size.value} value={size.value}>{size.label}px</option>
            ))}
          </select>
          
          {/* 줄간격 드롭다운 */}
          <select 
            onChange={(e) => applyLineHeight(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded bg-white"
            defaultValue=""
          >
            <option value="" disabled>줄간격</option>
            {LINE_HEIGHTS.map((lh) => (
              <option key={lh.value} value={lh.value}>{lh.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={syncToState}
        onInput={syncToState}
        className="min-h-[200px] px-4 py-3 focus:outline-none"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  )
}

const OPACITY_PRESETS = [
  { label: '40%', value: 0.4 },
  { label: '60%', value: 0.6 },
  { label: '80%', value: 0.8 },
  { label: '100%', value: 1 },
]

const HIDE_HOURS_PRESETS = [
  { label: '6시간', value: 6 },
  { label: '12시간', value: 12 },
  { label: '24시간', value: 24 },
  { label: '48시간', value: 48 },
]

export default function PopupAdminPage() {
  const { token } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [isHtmlMode, setIsHtmlMode] = useState(false)
  
  const [form, setForm] = useState<Popup>({
    title: '',
    contentHtml: '',
    defaultTextColor: '#ffffff',
    bgColor: '#1f2937',
    bgOpacity: 0.8,
    link: '',
    linkText: '자세히 보기',
    isActive: false,
    hideHours: 12,
    forceShowVersion: 1
  })

  const loadPopup = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/popup?admin=true')
      const result = await res.json()
      if (result.success && result.data) {
        const data = result.data
        let contentHtml = data.contentHtml || ''
        if (!contentHtml && (data.titleHtml || data.subtitleHtml)) {
          contentHtml = [data.titleHtml, data.subtitleHtml].filter(Boolean).join('<br><br>')
        }
        setForm({
          _id: data._id,
          title: data.title || '',
          contentHtml: contentHtml,
          defaultTextColor: data.defaultTextColor || '#ffffff',
          bgColor: data.bgColor || '#1f2937',
          bgOpacity: data.bgOpacity ?? 0.8,
          link: data.link || '',
          linkText: data.linkText || '자세히 보기',
          isActive: data.isActive || false,
          hideHours: data.hideHours ?? 12,
          forceShowVersion: data.forceShowVersion ?? 1
        })
      }
    } catch { setMessage({ type: 'error', text: '팝업을 불러오는데 실패했습니다' }) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadPopup() }, [loadPopup])
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t) } }, [message])

  const savePopup = async () => {
    if (!token || !form.contentHtml.trim()) {
      setMessage({ type: 'error', text: '내용을 입력해주세요' })
      return
    }
    try {
      const plainText = form.contentHtml.replace(/<[^>]*>/g, '').substring(0, 50)
      const res = await fetch('/api/popup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: plainText || '팝업',
          titleHtml: form.contentHtml,
          subtitleHtml: '',
          contentHtml: form.contentHtml
        })
      })
      const result = await res.json()
      if (result.success) {
        setMessage({ type: 'success', text: '팝업이 저장되었습니다' })
        loadPopup()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch { setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' }) }
  }

  const forceShow = async () => {
    if (!token) return
    if (!confirm('모든 사용자에게 팝업을 다시 표시합니다. 계속하시겠습니까?')) return
    try {
      const plainText = form.contentHtml.replace(/<[^>]*>/g, '').substring(0, 50)
      const res = await fetch('/api/popup', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          title: plainText || '팝업',
          titleHtml: form.contentHtml,
          subtitleHtml: '',
          forceShowVersion: (form.forceShowVersion || 1) + 1
        })
      })
      const result = await res.json()
      if (result.success) {
        setMessage({ type: 'success', text: '모든 사용자에게 팝업이 다시 표시됩니다' })
        loadPopup()
      }
    } catch { setMessage({ type: 'error', text: '오류가 발생했습니다' }) }
  }

  const getBgRgba = () => {
    const hex = form.bgColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${form.bgOpacity})`
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">모달 팝업 관리</h1>
              <p className="text-gray-600 mt-1">사이트 진입 시 표시되는 팝업을 관리합니다</p>
            </div>
            <div className="flex gap-2">
              <button onClick={forceShow} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">🔄 강제 표시</button>
              <button onClick={() => setShowPreview(!showPreview)} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
                {showPreview ? '미리보기 닫기' : '미리보기'}
              </button>
            </div>
          </div>

          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold">팝업 설정</h2>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-5 h-5" />
                  <label htmlFor="isActive" className="font-medium">
                    팝업 활성화
                    <span className="block text-sm text-gray-500">체크하면 사이트 방문자에게 팝업이 표시됩니다</span>
                  </label>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">닫기 후 다시 표시 간격</label>
                  <div className="flex gap-2">
                    {HIDE_HOURS_PRESETS.map((preset) => (
                      <button key={preset.value} onClick={() => setForm({ ...form, hideHours: preset.value })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${form.hideHours === preset.value ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{preset.label}</button>
                    ))}
                  </div>
                </div>

                {/* 편집 모드 토글 */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">편집 모드</span>
                  <div className="flex gap-2">
                    <button onClick={() => setIsHtmlMode(false)} className={`px-4 py-1.5 text-sm rounded-lg transition ${!isHtmlMode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>일반</button>
                    <button onClick={() => setIsHtmlMode(true)} className={`px-4 py-1.5 text-sm rounded-lg transition ${isHtmlMode ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>HTML</button>
                  </div>
                </div>

                {/* 에디터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">팝업 내용</label>
                  <WysiwygEditor 
                    value={form.contentHtml} 
                    onChange={(val) => setForm({ ...form, contentHtml: val })} 
                    isHtmlMode={isHtmlMode}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isHtmlMode ? 'HTML 태그를 직접 입력할 수 있습니다' : '텍스트를 선택한 후 서식을 적용하세요'}
                  </p>
                </div>

                {/* 링크 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL</label>
                    <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="/news/notices" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">버튼 텍스트</label>
                    <input type="text" value={form.linkText} onChange={(e) => setForm({ ...form, linkText: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="자세히 보기" />
                  </div>
                </div>

                {/* 스타일 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">스타일 설정</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">배경색</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        { color: '#1f2937', label: '기본' },
                        { color: '#000000', label: '검정' },
                        { color: '#c8102e', label: '빨강' },
                        { color: '#1e3a5f', label: '남색' },
                        { color: '#14532d', label: '초록' },
                      ].map((preset) => (
                        <button key={preset.color} onClick={() => setForm({ ...form, bgColor: preset.color })} className={`w-10 h-10 rounded-lg border-2 transition ${form.bgColor === preset.color ? 'border-primary ring-2 ring-primary/30' : 'border-gray-300'}`} style={{ backgroundColor: preset.color }} title={preset.label} />
                      ))}
                    </div>
                    <input type="text" value={form.bgColor} onChange={(e) => setForm({ ...form, bgColor: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="#1f2937" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">글자색</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {[
                        { color: '#ffffff', label: '흰색' },
                        { color: '#fbbf24', label: '노랑' },
                        { color: '#000000', label: '검정' },
                      ].map((preset) => (
                        <button key={preset.color} onClick={() => setForm({ ...form, defaultTextColor: preset.color })} className={`w-10 h-10 rounded-lg border-2 transition ${form.defaultTextColor === preset.color ? 'border-primary ring-2 ring-primary/30' : 'border-gray-300'}`} style={{ backgroundColor: preset.color }} title={preset.label} />
                      ))}
                    </div>
                    <input type="text" value={form.defaultTextColor} onChange={(e) => setForm({ ...form, defaultTextColor: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="#ffffff" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">배경 투명도</label>
                    <div className="flex gap-2">
                      {OPACITY_PRESETS.map((preset) => (
                        <button key={preset.value} onClick={() => setForm({ ...form, bgOpacity: preset.value })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${form.bgOpacity === preset.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{preset.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={savePopup} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">저장</button>
              </div>

              {/* 미리보기 */}
              {showPreview && (
                <div className="rounded-xl flex items-center justify-center min-h-[500px] relative" style={{ backgroundColor: getBgRgba() }}>
                  <button className="absolute top-4 right-4 text-2xl hover:opacity-70" style={{ color: form.defaultTextColor }}>✕</button>
                  <div className="text-center p-8 max-w-lg" style={{ color: form.defaultTextColor }}>
                    <div dangerouslySetInnerHTML={{ __html: form.contentHtml || '<p style="opacity:0.5">내용을 입력하세요</p>' }} />
                    {form.link && (
                      <span className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-lg text-lg mt-8">{form.linkText || '자세히 보기'}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
