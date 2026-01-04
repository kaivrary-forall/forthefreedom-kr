import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support | Freedom & Innovation',
  description: 'Support Freedom & Innovation. Join us in defending liberal democracy.',
}

export default function SupportPageEn() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Us</h1>
          <p className="text-xl text-gray-200">Your participation in defending liberal democracy</p>
        </div>
      </section>

      {/* Support Info */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Bank Account */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 text-center mb-12">
            <div className="mb-6">
              <i className="fas fa-university text-primary text-4xl mb-4"></i>
              <h2 className="text-2xl font-bold text-gray-900">Official Donation Account</h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
              <p className="text-gray-600 mb-2">Bank</p>
              <p className="text-xl font-bold text-gray-900 mb-4">NongHyup Bank</p>
              <p className="text-gray-600 mb-2">Account Number</p>
              <p className="text-2xl font-bold text-primary">301-0370-2539-11</p>
              <p className="text-gray-600 mt-4">Account Holder: Freedom & Innovation</p>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              <i className="fas fa-info-circle text-primary mr-2"></i>
              Donation Information
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-1"></i>
                <span>Donations are managed transparently in accordance with the Political Funds Act.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-1"></i>
                <span>Tax deduction benefits are available for donations under 100,000 KRW per year.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fas fa-check text-primary mt-1"></i>
                <span>Donation receipts are issued upon request.</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Donation Inquiries</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:02-6952-0510" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                <i className="fas fa-phone"></i>
                <span>02-6952-0510</span>
              </a>
              <a href="mailto:forthefreedom@naver.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
                <i className="fas fa-envelope"></i>
                <span>forthefreedom@naver.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
