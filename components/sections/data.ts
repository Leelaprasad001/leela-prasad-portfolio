export const nav = ['About', 'Experience', 'Projects', 'Skills']

export const services = [
  ['01', 'Full-stack product engineering', 'Designing and shipping responsive web applications from interface to API.'],
  ['02', 'AI and data systems', 'Building practical ML, RAG, and LLM-powered workflows for real business use.'],
  ['03', 'Automation and platform workflows', 'Creating reliable pipelines and integrations that reduce manual effort and improve decisions.'],
  ['04', 'System design expert', 'Designing scalable architectures, service boundaries, and resilient systems for long-term growth.'],
] as const

export const projects = [
  {
    name: 'Recordent',
    type: 'AI & FINTECH',
    description: 'Leading AI-driven credit risk engineering across enterprise platforms, including RAG-based AI assistants, risk assessment agents, credit intelligence, scalable registry workflows, ERP integrations, and secure microservices.',
    tags: ['NestJS', 'TypeScript', 'FastAPI', 'Azure', 'AWS'],
    art: '↗',
    href: 'http://recordent.com/',
  },
  {
    name: 'CropQ - AI Agriculture Insights',
    type: 'AI PLATFORM',
    description: 'Built an AI agriculture platform for crop identification, recommendations, and disease analysis with chatbot and weather intelligence support.',
    tags: ['MERN', 'Tailwind', 'Python', 'ML', 'FastAPI'],
    art: '◌',
    href: 'https://cropq.vercel.app/',
  },
  {
    name: 'DocsLite - Collaborative Workspace',
    type: 'REAL-TIME COLLAB',
    description: 'Created a collaborative document workspace with real-time editing, comments, notifications, and secure authentication for team workflows.',
    tags: ['Next.js', 'TypeScript', 'Yjs', 'Clerk', 'Sentry'],
    art: '✦',
    href: 'https://docslite.vercel.app/',
  },
  {
    name: 'AI Powered Smart Mall Management',
    type: 'COMPUTER VISION',
    description: 'Designed an AI mall management system with real-time analytics, YOLOv8-based tracking, and operational dashboards to improve monitoring efficiency.',
    tags: ['MERN', 'OpenCV', 'YOLOv8', 'Python', 'FastAPI'],
    art: '∿',
    href: 'https://github.com/Leelaprasad001/AI-Powered-Smart-Mall-Management-System/',
  }
]

export const skills = [
  ['Programming Languages', 'JavaScript, TypeScript, Java, Python, C++, SQL'],
  ['Frameworks & Libraries', 'NestJS, Node.js, Next.js, React, Angular, Express.js, Spring Boot, FastAPI, Cypress'],
  ['Databases', 'MySQL, PostgreSQL, MongoDB, Redis'],
  ['Cloud & DevOps', 'Azure, AWS, Docker, Git, Linux, Heruku'],
  ['AI Technologies & Tools', 'ML, DL, NLP, RAG, LLMs, DeepEval, pgvector, GitHub Copilot, Cursor, Claude Code'],
  ['Core Concepts', 'System Design, Distributed Systems, REST APIs, Microservices, OOP, DSA, Computer Networks'],
] as const

export const timeline = [
  [
    'Dec 2024 - Present',
    'Recordent - AI Full Stack Developer (Staff Engineer)',
    'Leading AI and full-stack engineering across enterprise platforms, including scoring microservices, AI support chatbot (RAG), large-scale registry workflows, ERP integrations, and AI decision assistant development.',
    'Node.js · NestJS · TypeScript · Python · FastAPI · React · Angular · MySQL · PostgreSQL · Azure · AWS',
  ],
  [
    'Nov 2023 - Feb 2024',
    'IIPE - Full Stack Developer Intern',
    'Built a full-stack Bill Management System with secured REST APIs, and improved application performance, security, and SEO to achieve a 95% Lighthouse score.',
    'React · Spring Boot · PostgreSQL · REST APIs · Performance Optimization',
  ],
] as const

export const announcementPhrases = [
  'Building reliable AI systems for real-world product workflows.',
  'Focused on clarity, speed, and measurable product impact.',
  'Open to meaningful collaborations in AI, full-stack, and web platforms.',
  'Designing thoughtful software that turns complexity into decisions.',
] as const

export const marqueeItems = [
  'AI Workflow Design',
  'RAG and LLM Applications',
  'Full-Stack Product Development',
  'Web Platform Automation',
  'Data Science and Machine Learning',
  'Cloud and API Engineering',
] as const
