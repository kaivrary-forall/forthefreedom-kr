import { HomeData } from './home.ko'

export const homeDataEn: HomeData = {
  hero: {
    title: 'Freedom & Innovation',
    subtitle: 'New Politics through Liberal Democracy and Innovation',
    backgroundImage: '/images/hero-image.jpg',
    cta: {
      primary: { text: 'Join Party', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3' },
      secondary: { text: 'About Us', href: '/about' }
    }
  },
  values: [
    {
      id: 'democracy',
      icon: 'fa-flag',
      title: 'Defend Liberal Democracy',
      description: 'We defend the liberal democratic system based on the spirit of the Korean Constitution.'
    },
    {
      id: 'election',
      icon: 'fa-vote-yea',
      title: 'Eradicate Election Fraud',
      description: 'We build transparent and fair election systems to protect democracy.'
    },
    {
      id: 'security',
      icon: 'fa-shield-alt',
      title: 'Fight Anti-National Forces',
      description: 'We fight against forces that threaten liberal democracy and strengthen national security.'
    },
    {
      id: 'innovation',
      icon: 'fa-rocket',
      title: 'Innovation & Progress',
      description: 'We lead the 4th Industrial Revolution and create an innovative future.'
    }
  ],
  news: [
    {
      id: '1',
      category: 'Notice',
      title: 'Freedom & Innovation official website has been renewed',
      date: '2025.01.15',
      href: '/news'
    },
    {
      id: '2',
      category: 'Press',
      title: 'Chairman Hwang holds rally for defending liberal democracy',
      date: '2025.01.10',
      href: '/news'
    },
    {
      id: '3',
      category: 'Events',
      title: 'Nationwide regional chapter preparation committees launched',
      date: '2025.01.05',
      href: '/news'
    }
  ],
  participation: [
    {
      id: 'join',
      icon: 'fa-user-plus',
      title: 'Join Party',
      description: 'Become an official member and participate in politics.',
      linkText: 'Join Now',
      href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3',
      external: true
    },
    {
      id: 'support',
      icon: 'fa-hand-holding-heart',
      title: 'Donate',
      description: 'Support our policies and activities with your donation.',
      linkText: 'Donate',
      href: '/support'
    },
    {
      id: 'volunteer',
      icon: 'fa-hands-helping',
      title: 'Volunteer',
      description: 'Participate directly through various volunteer activities.',
      linkText: 'Volunteer',
      href: 'https://form.naver.com/response/MKeLmPClw_FBjrqaWJTDdw',
      external: true
    },
    {
      id: 'policy',
      icon: 'fa-lightbulb',
      title: 'Policy Proposal',
      description: 'Propose and develop policies with your voice.',
      linkText: 'Propose',
      href: '/report-center'
    }
  ],
  gallery: [
    { id: '1', image: '/images/activity.jpg', title: 'Member Meeting' },
    { id: '2', image: '/images/activity2.jpg', title: 'Community Outreach' },
    { id: '3', image: '/images/activity3.jpg', title: 'Party Activities' },
    { id: '4', image: '/images/flag-pic.jpg', title: 'Regular Rally' },
    { id: '5', image: '/images/sit-pic.jpg', title: 'Conference' },
    { id: '6', image: '/images/night-pic.jpg', title: 'Night Rally' }
  ]
}
