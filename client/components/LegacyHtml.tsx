'use client'

import { useEffect, useRef } from 'react'

interface LegacyHtmlProps {
  html: string
  className?: string
}

/**
 * LegacyHtml - 기존 HTML을 React로 점진 이관하기 위한 브릿지 컴포넌트
 * 
 * 사용법:
 * 1. 기존 HTML 페이지의 <body> 내용을 복사
 * 2. app/legacy/[page]/page.tsx 에서 LegacyHtml로 렌더
 * 3. 나중에 React 컴포넌트로 천천히 교체
 * 
 * 주의:
 * - 기존 nav.js, footer.js 스크립트는 제거 (Navigation, Footer 컴포넌트가 대체)
 * - 외부 스크립트가 필요하면 useEffect에서 동적 로드
 */
export default function LegacyHtml({ html, className = '' }: LegacyHtmlProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 스크립트 태그 실행 (dangerouslySetInnerHTML은 스크립트를 실행 안 함)
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      
      // 속성 복사
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      
      // 인라인 스크립트 내용 복사
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent
      }
      
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * fetchLegacyHtml - 기존 HTML 파일을 가져오는 헬퍼 (빌드 타임용)
 * 
 * 사용법 (page.tsx에서):
 * const html = await fetchLegacyHtml('/legacy-pages/about.html')
 */
export async function fetchLegacyHtml(path: string): Promise<string> {
  // 서버 사이드에서 파일 읽기
  if (typeof window === 'undefined') {
    const fs = await import('fs/promises')
    const filePath = await import('path')
    const fullPath = filePath.join(process.cwd(), 'public', path)
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8')
      
      // body 내용만 추출 (nav, footer 제외)
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i)
      if (bodyMatch) {
        let bodyContent = bodyMatch[1]
        
        // navigation-container, footer-container 제거 (React 컴포넌트가 대체)
        bodyContent = bodyContent.replace(/<div id="navigation-container"><\/div>/gi, '')
        bodyContent = bodyContent.replace(/<div id="footer-container"><\/div>/gi, '')
        
        // nav.js, footer.js, side-widget.js 스크립트 태그 제거
        bodyContent = bodyContent.replace(/<script[^>]*src="[^"]*nav\.js"[^>]*><\/script>/gi, '')
        bodyContent = bodyContent.replace(/<script[^>]*src="[^"]*footer\.js"[^>]*><\/script>/gi, '')
        bodyContent = bodyContent.replace(/<script[^>]*src="[^"]*side-widget\.js"[^>]*><\/script>/gi, '')
        
        return bodyContent.trim()
      }
      
      return content
    } catch (error) {
      console.error('Failed to load legacy HTML:', path, error)
      return '<div>페이지를 불러올 수 없습니다.</div>'
    }
  }
  
  return ''
}
