

export const site = {
  name: 'Joshua Negre',
  role: 'Software Engineer',
  location: 'San Francisco, Talibon, Bohol, Philippines',

  timezone: 'Asia/Manila',
  email: 'wawangnegre20@gmail.com',
  resume: '', 
  description: 'Joshua Negre is a software engineer building fast, accessible products for the web.',


  headline: ['I build software', 'that feels *obvious*', 'to the people', 'who use it.'],

  intro:
    'Software engineer working across the frontend and the services behind it. I care about load times, keyboard users, and code the next person can read.',


  now: 'Open to full-time roles from early next year',
  status: 'Available for work',

  about: [
    'I build software for real people close to home: a motoshop counting every peso, a construction firm pricing its next job, a church network keeping its members connected, and farmers selling livestock online.',
    'Most of my work sits where product and engineering meet: turning a rough idea into something shippable, then measuring whether it actually helped. I like small teams, short feedback loops, and writing things down.',
    "Outside work I'm usually reading, cooking something too ambitious for a weeknight, or tinkering with an open-source tool I depend on.",
  ],

 
  skills: [
    { group: 'Practices', items: ['Accessibility (WCAG 2.2)', 'Performance budgets', 'Testing', 'Code review'] },
  ],

  // Names should match the `tech` lists in src/content/projects so the
  // "used in" counts line up.
  stack: [
    { group: 'Languages', items: ['TypeScript', 'PHP', 'Python', 'Java', 'VB.NET', 'Arduino C++'] },
    { group: 'Frontend', items: ['React', 'React Native', 'Expo', 'Expo Router', 'React Router', 'Tailwind CSS', 'Zustand', 'Astro'] },
    { group: 'Backend', items: ['Node.js', 'Express', 'Laravel', 'ASP.NET', 'Socket.IO', 'GraphQL'] },
    { group: 'Data', items: ['MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Drizzle ORM'] },
    { group: 'Desktop & hardware', items: ['Electron', 'ESP32'] },
    { group: 'Infra & tooling', items: ['Docker', 'nginx', 'AWS', 'Firebase Cloud Messaging', 'Vitest', 'Caddy', 'Cloudflare', 'Laravel Reverb', 'Google OAuth'] },
  ],

  experience: [
    { years: '2026', role: 'DevOps engineer', org: 'AgroBenta', note: 'Livestock marketplace, team project', href: '/projects/agrobenta' },
    { years: 'Nov 2026', role: 'Desktop developer', org: 'JrBanz Motoshop', note: 'Offline point of sale and inventory', href: '/projects/jrbanz-pos' },
    { years: 'Oct 2026', role: 'Desktop developer', org: 'Ardico', note: 'Construction estimating and site audits', href: '/projects/ardico' },
    { years: 'Oct — Nov 2026', role: 'Full-stack developer', org: 'Faithly', note: 'Church app, real-time API and admin site', href: '/projects/faithly' },
    { years: 'Mar — May 2026', role: 'Hardware and full-stack developer', org: 'ProfScan', note: 'QR attendance system, capstone project', href: '/projects/profscan' },
  ],

  socials: [
    { label: 'GitHub', href: 'https://github.com/joshuanegre20' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/joshua-negre-4a2142442/' },
    { label: 'Facebook', href: 'https://www.facebook.com/joshua.negre.9'},
    { label: 'Fiverr', href: 'https://www.fiverr.com/users/itsjoshua_desu/portfolio/' },
  ],


  source: 'https://github.com/joshuanegre20/joshuanegre20.github.io',
};

export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  { label: 'Stack', href: '/#stack' },
  { label: 'Writing', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];
