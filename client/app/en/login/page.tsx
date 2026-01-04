import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login | Freedom & Innovation',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/en"><img src="/images/logo.png" alt="Freedom & Innovation" className="h-16 mx-auto mb-4" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Member Login</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" className="w-full px-4 py-3 border rounded-lg" placeholder="Enter username" disabled />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full px-4 py-3 border rounded-lg" placeholder="Enter password" disabled />
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center"><i className="fas fa-info-circle mr-2"></i>Login system coming soon</p>
        </div>
        <button className="w-full mt-6 py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed" disabled>Login</button>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Not a member yet?</p>
          <a href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Join Now →</a>
        </div>
        <div className="mt-8 text-center">
          <Link href="/en" className="text-sm text-gray-500 hover:text-primary"><i className="fas fa-home mr-1"></i> Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
