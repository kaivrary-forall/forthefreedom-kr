'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import LandingPageRenderer from '@/components/landing/LandingPageRenderer'
import { useAuth } from '@/contexts/AuthContext'

interface Block {
  id: string
  type: string
  data: Record<string, unknown>
}

interface LandingPageData {
  _id: string
  slug: string
  title: string
  blocks: Block[]
  settings: {
    backgroundColor?: string
    fontFamily?: string
  }
  isActive: boolean
}

const BLOCK_TYPES = [
  { type: 'hero', label: '히어로', icon: 'fas fa-image', desc: '큰 이미지 + 제목' },
  { type: 'text', label: '텍스트', icon: 'fas fa-align-left', desc: '제목 + 본문' },
  { type: 'image', label: '이미지', icon: 'fas fa-photo-video', desc: '단일 이미지' },
  { type: 'button', label: '버튼', icon: 'fas fa-hand-pointer', desc: '링크/전화 버튼' },
  { type: 'video', label: '영상', icon: 'fas fa-play-circle', desc: '유튜브/영상' },
  { type: 'divider', label: '구분선', icon: 'fas fa-minus', desc: '섹션 구분' },
  { type: 'contact', label: '연락처', icon: 'fas fa-phone-alt', desc: '전화/이메일/주소' },
  { type: 'sns', label: 'SNS', icon: 'fas fa-share-alt', desc: '소셜 링크' },
  { type: 'gallery', label: '갤러리', icon: 'fas fa-th', desc: '이미지 그리드' },
  { type: 'spacer', label: '여백', icon: 'fas fa-arrows-alt-v', desc: '빈 공간' },
]

export default function LandingEditPage() {
  const params = useParams()
  const id = params.id as string
  const { token } = useAuth()
  const [page, setPage] = useState<LandingPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const fetchPage = useCallback(async () => {
    if (!token) return
    
    try {
      const res = await fetch(`/api/admin/landing/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.page) {
        setPage(data.page)
      }
    } catch (error) {
      console.error('Failed to fetch page:', error)
    } finally {
      setLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    fetchPage()
  }, [fetchPage])

  const savePage = async () => {
    if (!page || !token) return
    setSaving(true)
    
    try {
      await fetch(`/api/admin/landing/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(page)
      })
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const addBlock = (type: string) => {
    if (!page) return
    
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      data: getDefaultBlockData(type)
    }
    setPage({
      ...page,
      blocks: [...page.blocks, newBlock]
    })
    setShowBlockPicker(false)
    setSelectedBlockId(newBlock.id)
  }

  const updateBlock = (blockId: string, data: Record<string, unknown>) => {
    if (!page) return
    
    setPage({
      ...page,
      blocks: page.blocks.map(b => 
        b.id === blockId ? { ...b, data } : b
      )
    })
  }

  const deleteBlock = (blockId: string) => {
    if (!page) return
    
    setPage({
      ...page,
      blocks: page.blocks.filter(b => b.id !== blockId)
    })
    setSelectedBlockId(null)
  }

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!page) return
    
    const idx = page.blocks.findIndex(b => b.id === blockId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === page.blocks.length - 1) return

    const newBlocks = [...page.blocks]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]]
    setPage({ ...page, blocks: newBlocks })
  }

  const selectedBlock = page?.blocks.find(b => b.id === selectedBlockId)

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="text-center py-12">로딩 중...</div>
        </main>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="text-center py-12">페이지를 찾을 수 없습니다.</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 ml-64">
        {/* 상단 툴바 */}
        <div className="sticky top-0 z-30 bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/landing" className="p-2 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="text-lg font-bold border-none focus:ring-0 p-0"
              />
              <p className="text-sm text-gray-500">/l/{page.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={page.isActive}
                onChange={(e) => setPage({ ...page, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              공개
            </label>
            <a
              href={`/l/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              미리보기
            </a>
            <button
              onClick={savePage}
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        <div className="flex">
          {/* 왼쪽: 블록 목록 */}
          <div className="w-72 bg-white border-r h-[calc(100vh-65px)] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">블록</h3>
              <button
                onClick={() => setShowBlockPicker(true)}
                className="text-primary hover:bg-primary/5 px-2 py-1 rounded text-sm"
              >
                + 추가
              </button>
            </div>

            {page.blocks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-layer-group text-3xl mb-2"></i>
                <p className="text-sm">블록을 추가하세요</p>
              </div>
            ) : (
              <div className="space-y-2">
                {page.blocks.map((block, idx) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                      selectedBlockId === block.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${BLOCK_TYPES.find(t => t.type === block.type)?.icon} text-gray-400 w-5`}></i>
                    <span className="flex-1 text-sm">
                      {BLOCK_TYPES.find(t => t.type === block.type)?.label}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <i className="fas fa-chevron-up text-xs"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}
                        disabled={idx === page.blocks.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <i className="fas fa-chevron-down text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 중앙: 미리보기 */}
          <div className="flex-1 p-8 flex justify-center bg-gray-200 h-[calc(100vh-65px)] overflow-y-auto">
            <div className="w-[390px] bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-gray-800">
              {/* 폰 노치 */}
              <div className="h-8 bg-gray-800 flex justify-center items-end pb-1">
                <div className="w-20 h-5 bg-black rounded-full"></div>
              </div>
              {/* 컨텐츠 */}
              <div className="h-[700px] overflow-y-auto">
                <LandingPageRenderer page={page} />
              </div>
            </div>
          </div>

          {/* 오른쪽: 블록 편집기 */}
          <div className="w-80 bg-white border-l h-[calc(100vh-65px)] overflow-y-auto">
            {selectedBlock ? (
              <BlockEditor
                block={selectedBlock}
                onUpdate={(data) => updateBlock(selectedBlock.id, data)}
                onDelete={() => deleteBlock(selectedBlock.id)}
              />
            ) : (
              <div className="p-6 text-center text-gray-400">
                <i className="fas fa-mouse-pointer text-3xl mb-2"></i>
                <p className="text-sm">블록을 선택하세요</p>
              </div>
            )}
          </div>
        </div>

        {/* 블록 추가 모달 */}
        {showBlockPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md m-4 max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
                <h3 className="font-bold">블록 추가</h3>
                <button onClick={() => setShowBlockPicker(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {BLOCK_TYPES.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="p-4 border-2 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    <i className={`${bt.icon} text-2xl text-primary mb-2`}></i>
                    <p className="font-medium">{bt.label}</p>
                    <p className="text-xs text-gray-500">{bt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 블록 에디터 컴포넌트
function BlockEditor({ 
  block, 
  onUpdate, 
  onDelete 
}: { 
  block: Block
  onUpdate: (data: Record<string, unknown>) => void
  onDelete: () => void
}) {
  const data = block.data

  const update = (key: string, value: unknown) => {
    onUpdate({ ...data, [key]: value })
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">
          {BLOCK_TYPES.find(t => t.type === block.type)?.label} 설정
        </h3>
        <button
          onClick={onDelete}
          className="text-red-500 hover:bg-red-50 p-2 rounded-lg text-sm"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>

      <div className="space-y-4">
        {/* 히어로 블록 */}
        {block.type === 'hero' && (
          <>
            <Input label="이미지 URL" value={data.imageUrl as string} onChange={(v) => update('imageUrl', v)} placeholder="배경 이미지 (유튜브 없을 때)" />
            <Input label="유튜브 URL" value={data.youtubeUrl as string} onChange={(v) => update('youtubeUrl', v)} placeholder="https://youtube.com/watch?v=..." />
            <p className="text-xs text-gray-500 -mt-2">유튜브 URL 입력 시 배경 영상으로 자동재생됩니다</p>
            <Select label="영상 비율" value={data.videoRatio as string || '16:9'} onChange={(v) => update('videoRatio', v)}
              options={[
                { value: '16:9', label: '가로 (16:9)' },
                { value: '4:5', label: '세로 (4:5)' },
                { value: '9:16', label: '세로 (9:16)' },
                { value: '1:1', label: '정방형 (1:1)' },
              ]}
            />
            <Input label="제목" value={data.title as string} onChange={(v) => update('title', v)} />
            <Input label="부제목" value={data.subtitle as string} onChange={(v) => update('subtitle', v)} />
            <Input label="높이" value={data.height as string || '300px'} onChange={(v) => update('height', v)} placeholder="300px" />
            <Checkbox label="어두운 오버레이" checked={data.overlay as boolean} onChange={(v) => update('overlay', v)} />
          </>
        )}

        {/* 텍스트 블록 */}
        {block.type === 'text' && (
          <>
            <Input label="제목" value={data.title as string} onChange={(v) => update('title', v)} />
            <Textarea label="내용" value={data.content as string} onChange={(v) => update('content', v)} />
            <Select label="정렬" value={data.align as string || 'left'} onChange={(v) => update('align', v)}
              options={[
                { value: 'left', label: '왼쪽' },
                { value: 'center', label: '가운데' },
                { value: 'right', label: '오른쪽' },
              ]}
            />
            <ColorPicker label="배경색" value={data.bgColor as string} onChange={(v) => update('bgColor', v)} />
            <ColorPicker label="글자색" value={data.textColor as string} onChange={(v) => update('textColor', v)} />
          </>
        )}

        {/* 이미지 블록 */}
        {block.type === 'image' && (
          <>
            <Input label="이미지 URL" value={data.imageUrl as string} onChange={(v) => update('imageUrl', v)} />
            <Input label="캡션" value={data.caption as string} onChange={(v) => update('caption', v)} />
            <Checkbox label="전체 너비" checked={data.fullWidth as boolean} onChange={(v) => update('fullWidth', v)} />
          </>
        )}

        {/* 버튼 블록 */}
        {block.type === 'button' && (
          <>
            <Input label="버튼 텍스트" value={data.text as string} onChange={(v) => update('text', v)} />
            <Select label="동작" value={data.action as string || 'link'} onChange={(v) => update('action', v)}
              options={[
                { value: 'link', label: 'URL 이동' },
                { value: 'tel', label: '전화걸기' },
              ]}
            />
            <Input 
              label={data.action === 'tel' ? '전화번호' : 'URL'} 
              value={data.url as string} 
              onChange={(v) => update('url', v)} 
              placeholder={data.action === 'tel' ? '010-1234-5678' : 'https://'}
            />
            <Select label="스타일" value={data.style as string || 'primary'} onChange={(v) => update('style', v)}
              options={[
                { value: 'primary', label: '기본 (빨강)' },
                { value: 'secondary', label: '검정' },
                { value: 'outline', label: '테두리' },
                { value: 'white', label: '흰색' },
                { value: 'kakao', label: '카카오' },
                { value: 'naver', label: '네이버' },
              ]}
            />
            <Input label="아이콘 (FontAwesome)" value={data.icon as string} onChange={(v) => update('icon', v)} placeholder="fas fa-phone" />
          </>
        )}

        {/* 영상 블록 */}
        {block.type === 'video' && (
          <>
            <Input label="유튜브 ID" value={data.youtubeId as string} onChange={(v) => update('youtubeId', v)} placeholder="dQw4w9WgXcQ" />
            <p className="text-xs text-gray-500">또는</p>
            <Input label="영상 URL" value={data.videoUrl as string} onChange={(v) => update('videoUrl', v)} />
          </>
        )}

        {/* 구분선 블록 */}
        {block.type === 'divider' && (
          <>
            <Select label="스타일" value={data.style as string || 'line'} onChange={(v) => update('style', v)}
              options={[
                { value: 'line', label: '선' },
                { value: 'dots', label: '점' },
                { value: 'space', label: '빈 공간' },
              ]}
            />
            <ColorPicker label="색상" value={data.color as string || '#e5e5e5'} onChange={(v) => update('color', v)} />
          </>
        )}

        {/* 연락처 블록 */}
        {block.type === 'contact' && (
          <>
            <Input label="제목" value={data.title as string} onChange={(v) => update('title', v)} placeholder="연락처" />
            <Input label="전화번호" value={data.phone as string} onChange={(v) => update('phone', v)} />
            <Input label="이메일" value={data.email as string} onChange={(v) => update('email', v)} />
            <Input label="주소" value={data.address as string} onChange={(v) => update('address', v)} />
          </>
        )}

        {/* SNS 블록 */}
        {block.type === 'sns' && (
          <SNSEditor 
            links={(data.links as Array<{ platform: string; url: string }>) || []} 
            onChange={(v) => update('links', v)} 
          />
        )}

        {/* 갤러리 블록 */}
        {block.type === 'gallery' && (
          <>
            <GalleryEditor 
              images={(data.images as string[]) || []} 
              onChange={(v) => update('images', v)} 
            />
            <Select label="열 수" value={String(data.columns || 2)} onChange={(v) => update('columns', parseInt(v))}
              options={[
                { value: '2', label: '2열' },
                { value: '3', label: '3열' },
              ]}
            />
          </>
        )}

        {/* 여백 블록 */}
        {block.type === 'spacer' && (
          <Input 
            label="높이 (px)" 
            value={String(data.height || 20)} 
            onChange={(v) => update('height', parseInt(v) || 20)} 
            type="number"
          />
        )}
      </div>
    </div>
  )
}

// 헬퍼 컴포넌트들
function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string | undefined
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  )
}

function Textarea({ label, value, onChange }: {
  label: string
  value: string | undefined
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: {
  label: string
  checked: boolean | undefined
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      {label}
    </label>
  )
}

function ColorPicker({ label, value, onChange }: {
  label: string
  value: string | undefined
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded border cursor-pointer"
        />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#ffffff"
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function SNSEditor({ links, onChange }: {
  links: Array<{ platform: string; url: string }>
  onChange: (v: Array<{ platform: string; url: string }>) => void
}) {
  const platforms = ['instagram', 'facebook', 'youtube', 'twitter', 'kakao', 'naver', 'threads']

  const addLink = () => {
    onChange([...links, { platform: 'instagram', url: '' }])
  }

  const updateLink = (idx: number, key: string, value: string) => {
    const newLinks = [...links]
    newLinks[idx] = { ...newLinks[idx], [key]: value }
    onChange(newLinks)
  }

  const removeLink = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">SNS 링크</label>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={idx} className="flex gap-2">
            <select
              value={link.platform}
              onChange={(e) => updateLink(idx, 'platform', e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateLink(idx, 'url', e.target.value)}
              placeholder="URL"
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button onClick={() => removeLink(idx)} className="text-red-500 px-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
      <button onClick={addLink} className="mt-2 text-sm text-primary hover:underline">
        + 링크 추가
      </button>
    </div>
  )
}

function GalleryEditor({ images, onChange }: {
  images: string[]
  onChange: (v: string[]) => void
}) {
  const addImage = () => {
    onChange([...images, ''])
  }

  const updateImage = (idx: number, value: string) => {
    const newImages = [...images]
    newImages[idx] = value
    onChange(newImages)
  }

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">이미지 URL</label>
      <div className="space-y-2">
        {images.map((img, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="url"
              value={img}
              onChange={(e) => updateImage(idx, e.target.value)}
              placeholder="https://"
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button onClick={() => removeImage(idx)} className="text-red-500 px-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>
      <button onClick={addImage} className="mt-2 text-sm text-primary hover:underline">
        + 이미지 추가
      </button>
    </div>
  )
}

// 기본 블록 데이터
function getDefaultBlockData(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return { title: '', subtitle: '', height: '300px', overlay: false }
    case 'text':
      return { title: '', content: '', align: 'left' }
    case 'image':
      return { imageUrl: '', caption: '', fullWidth: false }
    case 'button':
      return { text: '버튼', url: '', style: 'primary', action: 'link' }
    case 'video':
      return { youtubeId: '', videoUrl: '' }
    case 'divider':
      return { style: 'line', color: '#e5e5e5' }
    case 'contact':
      return { title: '연락처', phone: '', email: '', address: '' }
    case 'sns':
      return { links: [] }
    case 'gallery':
      return { images: [], columns: 2 }
    case 'spacer':
      return { height: 20 }
    default:
      return {}
  }
}
