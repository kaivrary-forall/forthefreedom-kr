import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Receipt Request | Freedom & Innovation Party',
  description: 'Request donation receipts for tax deduction purposes.',
}

export default function SupportReceiptPage() {
  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Receipt Request</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
              <div className="flex items-start gap-4">
                <i className="fas fa-info-circle text-blue-600 text-xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">Automatic Submission Notice</h3>
                  <p className="text-blue-800 text-sm">
                    Donation receipts are <strong>automatically submitted to the National Tax Service</strong> for year-end tax settlement.<br />
                    Please request a receipt only if you need a separate copy.
                  </p>
                </div>
              </div>
            </div>

            {/* Tax Deduction Info */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Deduction Benefits</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <span className="text-gray-700">Up to 100,000 KRW</span>
                    <span className="font-bold text-primary">Full Tax Deduction (100%)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <span className="text-gray-700">Amount exceeding 100,000 KRW</span>
                    <span className="font-bold text-primary">15% Tax Deduction</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Example: For a 300,000 KRW donation: 100,000 (full) + 200,000×15% = 130,000 KRW tax deduction
                </p>
              </div>
            </div>

            {/* Online Receipt Request */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Receipt Request</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://form.naver.com/response/ia2iK2yzR1NT3vSYaqjPjw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-primary rounded-xl p-6 text-center hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <i className="fas fa-file-invoice text-primary text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Freedom & Innovation Party</h3>
                  <p className="text-sm text-gray-600 mb-4">Central Party Supporters Association</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    Request <i className="fas fa-arrow-right"></i>
                  </span>
                </a>

                <a 
                  href="https://form.naver.com/response/gjYSKrmFAFnfLgz1nvYsHw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-primary rounded-xl p-6 text-center hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <i className="fas fa-user-tie text-primary text-2xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Presidential Candidate</h3>
                  <p className="text-sm text-gray-600 mb-4">Hwang Kyo-ahn Supporters Association</p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold">
                    Request <i className="fas fa-arrow-right"></i>
                  </span>
                </a>
              </div>
            </div>

            {/* Other Request Methods */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Request Methods</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <h3 className="font-bold text-gray-900">Phone Request</h3>
                  </div>
                  <p className="text-gray-700 ml-14">
                    Central Party Office: <a href="tel:02-2634-2023" className="text-primary font-semibold">02-2634-2023</a>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <h3 className="font-bold text-gray-900">Email Request</h3>
                  </div>
                  <p className="text-gray-700 ml-14">
                    <a href="mailto:receipt@freeinno.kr" className="text-primary font-semibold">receipt@freeinno.kr</a>
                    <br />
                    <span className="text-sm text-gray-600">Please include your name, contact information, and donation date</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t">
              <Link 
                href="/en/support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-arrow-left"></i>
                Back to Donation Info
              </Link>
              <Link 
                href="/en/support/guide"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Donation Guide
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
