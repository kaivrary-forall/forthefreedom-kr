// Footer Component - 모든 페이지 공통 푸터
document.addEventListener('DOMContentLoaded', function() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
    <footer class="bg-gray-900 text-white py-8 sm:py-12 lg:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 class="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">자유와혁신</h3>
                    <p class="text-gray-400 mb-4 text-sm sm:text-base leading-relaxed">새로운 정치, 새로운 미래를 함께 만들어갑니다.</p>
                    <div class="flex space-x-4 mt-4">
                        <a href="javascript:void(0)" onclick="alert('준비중입니다. 잠시 후 다시 시도해 주세요.')" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-facebook-f text-xl"></i>
                        </a>
                        <a href="https://x.com/forthefreedom25" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://instagram.com/freedominnovation" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="https://youtube.com/@freedom-innovation" target="_blank" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-youtube text-xl"></i>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">연락처</h4>
                    <div class="space-y-2 text-gray-400 text-sm sm:text-base">
                        <p><i class="fas fa-map-marker-alt mr-2 text-red-500"></i>서울 용산구 청파로45길 19, 복조빌딩 3층</p>
                        <p class="text-xs text-gray-500">(지번: 서울 용산구 청파동3가 29-14, 우편번호: 04307)</p>
                        <p><i class="fas fa-phone mr-2 text-red-500"></i>02-2634-2023 / 02-2634-2024</p>
                        <p><i class="fas fa-fax mr-2 text-red-500"></i>FAX: 02-2634-2026</p>
                        <p><i class="fas fa-envelope mr-2 text-red-500"></i>forthefreedom2025@naver.com</p>
                        <p><i class="fas fa-globe mr-2 text-red-500"></i>www.forthefreedom.kr</p>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">빠른 링크</h4>
                    <div class="space-y-2 text-gray-400 text-sm sm:text-base">
                        <a class="block hover:text-white transition-colors" href="/about.html">당 소개</a>
                        <a class="block hover:text-white transition-colors" href="/about/policy.html">정책</a>
                        <a class="block hover:text-white transition-colors" href="/news.html">소식/활동</a>
                        <a class="block hover:text-white transition-colors" href="/members.html">당원가입</a>
                        <a class="block hover:text-white transition-colors" href="/support.html">후원</a>
                        <a class="block hover:text-white transition-colors" href="/resources.html">자료실</a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-6">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-400 text-xs sm:text-sm mb-4 md:mb-0">© 2025 자유와혁신. 모든 권리 보유.</p>
                    <div class="flex space-x-6 text-xs sm:text-sm">
                        <a href="/privacy-policy.html" class="text-gray-400 hover:text-white transition-colors">개인정보처리방침</a>
                        <a href="/terms-of-service.html" class="text-gray-400 hover:text-white transition-colors">이용약관</a>
                        <a href="/information-disclosure.html" class="text-gray-400 hover:text-white transition-colors">정보공개</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
        `;
    }
});
