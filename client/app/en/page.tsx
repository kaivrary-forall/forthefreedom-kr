import Link from 'next/link'
import HeroSlider from '@/components/home/HeroSlider'
import HomeSideWidgetsAPI from '@/components/home/HomeSideWidgetsAPI'
import HomeCalendarAPI from '@/components/home/HomeCalendarAPI'
import HomeNewsAPI from '@/components/home/HomeNewsAPI'

export const metadata = {
  title: 'Freedom & Innovation',
  description: 'Official website of Freedom & Innovation party. A conservative party for defending liberal democracy.',
}

export default function HomePageEn() {
  return (
    <div className="-mt-16">
      {/* Hero Section - Banner + Side Cards */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px]">
            <div className="lg:flex-[7] h-[400px] lg:h-full">
              <HeroSlider />
            </div>
            <HomeSideWidgetsAPI />
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <HomeCalendarAPI lang="en" />

      {/* News Section */}
      <HomeNewsAPI lang="en" />

      {/* Activity Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Activities</h2>
              <p className="text-gray-500 mt-1">Building new politics together</p>
            </div>
            <Link href="/en/news/gallery" className="text-primary hover:text-primary-dark font-medium flex items-center gap-1">
              Photo Gallery <i className="fas fa-arrow-right text-sm"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: '/images/activity.jpg', title: 'Party Meeting' },
              { src: '/images/activity2.jpg', title: 'Community Outreach' },
              { src: '/images/activity3.jpg', title: 'Party Activities' },
              { src: '/images/flag-pic.jpg', title: 'Regular Rally' },
              { src: '/images/sit-pic.jpg', title: 'Conference' },
              { src: '/images/night-pic.jpg', title: 'Night Rally' },
            ].map((item, i) => (
              <div key={i} className="relative h-48 md:h-56 rounded-2xl overflow-hidden group">
                <img 
                  src={item.src} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-bold text-lg">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Get Involved</h2>
            <p className="text-gray-500 mt-1">Anyone who shares our values can participate in various ways</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-user-plus text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Join Party</h3>
              <p className="text-sm text-gray-600">Become a member of Freedom & Innovation</p>
            </a>
            
            <Link 
              href="/en/participate/volunteer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-hands-helping text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Volunteer</h3>
              <p className="text-sm text-gray-600">Join our volunteer activities</p>
            </Link>
            
            <a 
              href="https://form.naver.com/response/MKeLmPClw_FBjrqaWJTDdw" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-bullhorn text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Report Center</h3>
              <p className="text-sm text-gray-600">Report election fraud and corruption</p>
            </a>
            
            <Link 
              href="/en/support"
              className="text-center p-6 border border-gray-200 rounded-2xl hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-2xl text-primary"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Donate</h3>
              <p className="text-sm text-gray-600">Support liberal democracy</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
