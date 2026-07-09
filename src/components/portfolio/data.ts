export type Project = {
  name: string;
  tagline: string;
  category: "Security" | "Game" | "Web";
  description: string;
  tech: string[];
  github: string;
  live?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    name: "ShadowTrace",
    tagline: "OSINT Intelligence Platform",
    category: "Security",
    description:
      "OSINT platform for investigating usernames, domains, and IP addresses across multiple public sources, with a correlation engine that maps relationships between discovered entities to visualize connections at a glance.",
    tech: ["JavaScript", "OSINT", "Node.js"],
    github: "https://github.com/Kaviya-1508/ShadowTrace",
    live: "https://shadowtrace.vercel.app",
    featured: true,
  },
  {
    name: "FormoraX",
    tagline: "Full-Stack Web App",
    category: "Web",
    description:
      "Forms & Feedback Management System. Create custom forms, share via public links, collect anonymous responses, with JWT auth, response dashboard, exports, and a dark glassmorphism UI.",
    tech: ["React 18", "TypeScript", "Vite", "Tailwind", "Spring Boot 3.2", "Java 17", "MongoDB Atlas", "JWT", "Vercel", "Render"],
    github: "https://github.com/Kaviya-1508/FormoraX",
    live: "https://formora-x-brown.vercel.app",
    featured: true,
  },
  {
    name: "EventHub",
    tagline: "Full-Stack Web App",
    category: "Web",
    description:
      "Role-based event management system for students and faculty. CRUD operations for event creation, update, listing, and deletion. Responsive React frontend integrated with three Spring Boot microservices and a MongoDB backend.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Spring Boot", "MongoDB", "Microservices"],
    github: "https://github.com/Kaviya-1508/IP_mini_project",
    live: "https://ip-mini-project-xi.vercel.app",
    featured: true,
  },
  {
    name: "Time Capsule",
    tagline: "Full-Stack Web App",
    category: "Web",
    description:
      "Write messages to your future self — delivered via scheduled email at a chosen future date. Full-stack with React frontend and Spring Boot backend, containerised with Docker.",
    tech: ["TypeScript", "React", "Java", "Spring Boot", "CSS", "Docker"],
    github: "https://github.com/Kaviya-1508/time-capsule",
    live: "https://time-capsule-frontend-sepia.vercel.app",
    featured: true,
  },
  {
    name: "2048 Game",
    tagline: "Web Game",
    category: "Game",
    description:
      "Modern fully responsive 2048 game. Merge tiles to reach 2048 with arrow keys + swipe controls, animated splash screen, persistent best score, and smooth tile animations.",
    tech: ["React 18", "TypeScript", "Vite", "CSS3"],
    github: "https://github.com/Kaviya-1508/2048-game",
    live: "https://two-zero-four-eight.netlify.app",
  },
  {
    name: "Network Traffic Analyzer",
    tagline: "Cybersecurity Tool",
    category: "Security",
    description:
      "Real-time packet sniffer with DoS/port scan threat detection, TCP/UDP analysis, suspicious port alerts (FTP, Telnet, SMB, RDP), BPF filtering, GUI + CLI modes, and CSV logging.",
    tech: ["Python", "Scapy"],
    github: "https://github.com/Kaviya-1508/Network-Traffic-Analyzer",
  },
  {
    name: "Snake Game (Raylib / C)",
    tagline: "Game Development",
    category: "Game",
    description:
      "Classic Snake rebuilt in C with Raylib. Two difficulty levels, sound effects, background music, bonus food after score milestones, pause/resume, high score tracking, and an animated game over screen.",
    tech: ["C", "Raylib", "GCC"],
    github: "https://github.com/Kaviya-1508/snake-game-raylib",
  },
  {
    name: "Emoji Shooter Game",
    tagline: "Game Development",
    category: "Game",
    description:
      "Mouse-controlled 2D shooter with animated emoji targets, real-time scoring, countdown timer, high-score tracking, sound effects, background music, and multiple game screens.",
    tech: ["Python", "Pygame"],
    github: "https://github.com/Kaviya-1508/Emoji-Shooter-Python",
  },
];

export const SKILLS = {
  Languages: [
    { name: "Python", level: 92 },
    { name: "Java", level: 85 },
    { name: "C", level: 80 },
  ],
  "Web & App": [
    { name: "HTML", level: 95 },
    { name: "CSS", level: 90 },
    { name: "JavaScript", level: 88 },
    { name: "TypeScript", level: 85 },
    { name: "ReactJS", level: 88 },
    { name: "Flask", level: 80 },
    { name: "Tailwind CSS", level: 90 },
    { name: "Spring Boot", level: 78 },
    { name: "Flutter/Dart", level: 75 },
  ],
  Databases: [
    { name: "MySQL", level: 85 },
    { name: "Oracle SQL", level: 75 },
    { name: "MongoDB", level: 82 },
    { name: "GraphDB", level: 65 },
    { name: "Neo4j", level: 65 },
  ],
  Tools: [
    { name: "GitHub", level: 92 },
    { name: "Git", level: 90 },
    { name: "VS Code", level: 95 },
    { name: "Android Studio", level: 75 },
    { name: "n8n", level: 70 },
    { name: "Render", level: 80 },
    { name: "IntelliJ", level: 80 },
    { name: "NetBeans", level: 70 },
  ],
  Cybersecurity: [
    { name: "Burp Suite", level: 80 },
    { name: "Nmap", level: 78 },
    { name: "CTF Solving", level: 82 },
    { name: "Basic Cryptography", level: 75 },
    { name: "TCP/IP", level: 82 },
    { name: "DNS", level: 80 },
    { name: "HTTP/HTTPS", level: 85 },
  ],
} as const;

export type SkillCategory = keyof typeof SKILLS;

export type Achievement = {
  icon: string;
  title: string;
  org: string;
  meta: string;
  tag: string;
  color: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    icon: "🏆",
    title: "1st Place — Agentic AI Mini Contest",
    org: "AI Student Chapter, SSN College of Engineering",
    meta: "Jul 2025",
    tag: "Competition",
    color: "#ffd60a",
  },
  {
    icon: "📜",
    title: "Virtual & Augmented Reality Systems",
    org: "NPTEL, IIT Guwahati",
    meta: "Score: 76%  ·  2026",
    tag: "Certification",
    color: "#00f5ff",
  },
  {
    icon: "📜",
    title: "Industry 4.0 and Industrial IoT",
    org: "NPTEL, IIT Kharagpur",
    meta: "Score: 84%  ·  2026",
    tag: "Certification",
    color: "#00ff88",
  },
];
