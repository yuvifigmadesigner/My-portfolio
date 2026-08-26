
// Site Background (Dark, Abstract, Moody)
export const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

// User Profile Picture (from Google Drive)
export const PROFILE_IMAGE_URL = "https://lh3.googleusercontent.com/d/1sEaz0CRdS33fnYTl-F1Oqpk_eue70wUv";

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuvrajgupta-ux/' },
  { label: 'Resume', href: '/Resume.pdf' },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01f2a01dd44b738e84?mp_source=share' },
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
];

export const SIDE_PROJECTS = [
  {
    id: 'redesign-screen',
    title: 'Award-Winning UX Frameworks',
    role: 'UX/UI Designer',
    date: 'Jan 2025 - Present',
    description: 'A deep dive into the end-to-end redesign that won 3rd Rank on the UXHack India leaderboard 2025.',
    image: 'https://s0.wp.com/mshots/v1/https%3A%2F%2Fredesigngallery.vercel.app%2F?w=1200&h=630',
    link: 'https://redesigngallery.vercel.app/',
    theme: 'beige',
    isIframe: true
  },
  {
    id: 'zef-project',
    title: 'Zef UX Design',
    role: 'Product UX Designer',
    date: '2026',
    description: 'Design & UX architecture for Zef.',
    image: '/zef/frame_719_4x.webp',
    link: '',
    theme: 'red',
    isIframe: false
  },
  {
    id: 'assignment-folder',
    title: 'Assignment Folder',
    role: 'UX/UI Designer',
    date: '2025 - 2026',
    description: 'A curated collection of design assignments and technical case studies.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Abstract placeholder
    link: '#',
    theme: 'gray',
    isPopup: true,
    subProjects: [
      {
        id: 'cap-project',
        title: 'College Access Program (CAP)',
        role: 'Product Designer',
        date: '2025',
        description: 'Restructured navigation around audience intent and surfaced a live updates strip on landing.',
        image: '/CAP/cap.webp',
        link: '#cap',
        theme: 'blue'
      },
      {
        id: 'cargo-project',
        title: 'Fleet Logistics by VCBAY (Cargo)',
        role: 'Product Designer',
        date: '2025',
        description: 'Single control tower where dispatchers see live exceptions instead of scanning full lists.',
        image: '/cargo/cargo_4x.webp',
        link: '',
        theme: 'orange'
      },
      {
        id: 'sqm-project',
        title: 'Supplier Query Management (SQM)',
        role: 'Product Designer',
        date: '2025',
        description: 'Centralized certificates, audits, and query threads into one screen with templated updates.',
        image: '/SQM/sqm.webp',
        link: '',
        theme: 'emerald'
      }
    ]
  },
  {
    id: 'practice-stuffs',
    title: 'Practice Stuffs',
    role: 'UX/UI Designer',
    date: '2024 - Present',
    description: 'Experimental UI components, micro-interactions, and visual explorations.',
    image: 'https://images.unsplash.com/photo-1557683311-e49222407444?q=80&w=2555&auto=format&fit=crop', // Abstract placeholder
    link: '#',
    theme: 'teal',
    isPopup: true,
    subProjects: [] // Empty for now, but triggers popup or external link
  }
];
