import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report Center | Freedom & Innovation',
  description: 'Freedom & Innovation Election Fraud / Anti-National Forces Report Center',
}

export default function ReportCenterPageEn() {
  return (
    <div className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
          <div className="w-24 h-24 bg-red-50 rounded-full mx-auto mb-8 flex items-center justify-center">
            <i className="fas fa-tools text-primary text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h1>
          <p className="text-lg text-gray-600 mb-8">
            We are preparing the Election Fraud and Anti-National Forces Report Center.<br />
            The service will be available soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/en" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              <i className="fas fa-home mr-2"></i>Back to Home
            </a>
            <a href="tel:02-6952-0510" className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
              <i className="fas fa-phone mr-2"></i>Call: 02-6952-0510
            </a>
          </div>
        </div>

        {/* Temporary Contact Info */}
        <div className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            <i className="fas fa-info-circle text-primary mr-2"></i>Report Information
          </h3>
          <p className="text-gray-600 mb-6">
            Until the Report Center opens, please contact us through the following channels.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">02-6952-0510</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold text-gray-900">report@freeinno.kr</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
