/**
 * side-widget.js (Grid Rails version)
 * - No left/right position calculations.
 * - Renders content into #side-banner-left / #side-banner-right which live inside the page grid.
 * - Updates CSS variables (--nav-height, --announcement-height) so sticky top aligns with nav + announcement bar.
 */

(function () {
  const LEFT_ID = 'side-banner-left';
  const RIGHT_ID = 'side-banner-right';

  function qs(id) {
    return document.getElementById(id);
  }

  function updateStickyTopVars() {
    const nav = document.querySelector('#navigation-container nav') || document.querySelector('nav');
    const announcement = document.getElementById('announcement-bar');

    const navH = nav ? Math.ceil(nav.getBoundingClientRect().height) : 0;
    const annH = announcement ? Math.ceil(announcement.getBoundingClientRect().height) : 0;

    document.documentElement.style.setProperty('--nav-height', `${navH}px`);
    document.documentElement.style.setProperty('--announcement-height', `${annH}px`);
  }

  function renderDayCounter(el) {
    // Existing project copy:
    // "자유와혁신의 발걸음 / 우리가 함께한 지"
    // If your project has a canonical start date elsewhere, wire it here.
    const startDateStr = el.getAttribute('data-start-date') || '2025-01-01'; // fallback
    const start = new Date(startDateStr + 'T00:00:00');
    const now = new Date();

    const ms = now.getTime() - start.getTime();
    const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));

    el.innerHTML = `
      <div class="side-card" style="background:#fff;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:14px;">
        <div style="font-size:12px;color:#666;font-weight:600;line-height:1.25;">자유와혁신의 발걸음</div>
        <div style="font-size:12px;color:#666;margin-top:2px;line-height:1.25;">우리가 함께한 지</div>
        <div style="font-size:28px;font-weight:800;margin-top:8px;letter-spacing:-.5px;">${days}<span style="font-size:14px;font-weight:700;margin-left:6px;color:#444;">일</span></div>
      </div>
    `;
  }

  function renderMemberInfo(el) {
    // Very lightweight: depends on existing project auth storage keys.
    // If your project uses different keys, adjust only here.
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const memberInfoRaw = localStorage.getItem('memberInfo') || sessionStorage.getItem('memberInfo');
    let memberInfo = null;
    try { memberInfo = memberInfoRaw ? JSON.parse(memberInfoRaw) : null; } catch (e) {}

    const loggedIn = !!token && !!memberInfo;

    if (!loggedIn) {
      el.innerHTML = `
        <div class="side-card" style="background:#fff;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:14px;">
          <div style="font-size:12px;color:#666;font-weight:600;">회원</div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:10px;">
            <a href="login.html" style="display:block;text-align:center;padding:10px 12px;border-radius:10px;background:#111;color:#fff;font-weight:700;text-decoration:none;">로그인</a>
            <a href="signup.html" style="display:block;text-align:center;padding:10px 12px;border-radius:10px;background:#f2f2f2;color:#111;font-weight:700;text-decoration:none;">회원가입</a>
          </div>
        </div>
      `;
      return;
    }

    const name = memberInfo?.name || memberInfo?.nickname || '회원';
    const email = memberInfo?.email || '';

    el.innerHTML = `
      <div class="side-card" style="background:#fff;border-radius:14px;box-shadow:0 6px 18px rgba(0,0,0,.08);padding:14px;">
        <div style="font-size:12px;color:#666;font-weight:600;">회원</div>
        <div style="margin-top:10px;display:flex;gap:10px;align-items:center;">
          <div style="width:38px;height:38px;border-radius:50%;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;">
            ${String(name).trim().slice(0,1)}
          </div>
          <div style="min-width:0;">
            <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
            <div style="font-size:12px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${email}</div>
          </div>
        </div>
        <div style="margin-top:12px;">
          <a href="mypage.html" style="display:block;text-align:center;padding:10px 12px;border-radius:10px;background:#f2f2f2;color:#111;font-weight:800;text-decoration:none;">내 정보</a>
        </div>
      </div>
    `;
  }

  function init() {
    const left = qs(LEFT_ID);
    const right = qs(RIGHT_ID);

    // If this page doesn't have the rails, do nothing.
    if (!left || !right) return;

    // Render content
    renderDayCounter(left);
    renderMemberInfo(right);

    // Keep sticky top aligned when nav/announcement changes
    updateStickyTopVars();

    // Recompute on resize and when announcement/nav might change
    window.addEventListener('resize', updateStickyTopVars, { passive: true });

    // Observe DOM changes to nav / announcement to avoid "jump" after async load.
    const obs = new MutationObserver(() => updateStickyTopVars());
    obs.observe(document.body, { childList: true, subtree: true });

    // Expose for other scripts (nav.js) if they want to force refresh after inserting announcement
    window.adjustBannerPosition = updateStickyTopVars;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
