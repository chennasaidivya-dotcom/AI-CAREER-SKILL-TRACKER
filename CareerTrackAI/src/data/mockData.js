// ============================================================
// Mock Data Store — simulates a backend + AI engine
// ============================================================

export const CAREER_PATHS = [
  {
    id: "fullstack",
    title: "Full Stack Developer",
    icon: "💻",
    description: "Build end-to-end web applications with modern tech stacks.",
    avgSalary: "$95,000",
    demand: "Very High",
    requiredSkills: [
      "JavaScript", "React", "Node.js", "HTML/CSS",
      "SQL", "REST APIs", "Git", "TypeScript"
    ],
    advancedSkills: ["GraphQL", "Docker", "AWS", "Redis", "Microservices"],
    color: "#6366f1"
  },
  {
    id: "datascience",
    title: "Data Scientist",
    icon: "📊",
    description: "Extract insights from data using statistics and machine learning.",
    avgSalary: "$110,000",
    demand: "High",
    requiredSkills: [
      "Python", "Statistics", "Machine Learning", "SQL",
      "Data Visualization", "Pandas", "NumPy", "Scikit-learn"
    ],
    advancedSkills: ["Deep Learning", "TensorFlow", "Spark", "R", "NLP"],
    color: "#8b5cf6"
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: "⚙️",
    description: "Bridge development and operations with automation and CI/CD.",
    avgSalary: "$105,000",
    demand: "High",
    requiredSkills: [
      "Linux", "Docker", "Kubernetes", "CI/CD",
      "AWS/Azure/GCP", "Terraform", "Python/Bash", "Git"
    ],
    advancedSkills: ["Prometheus", "Grafana", "Ansible", "Service Mesh", "Security"],
    color: "#06b6d4"
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    icon: "🔐",
    description: "Protect systems and data from cyber threats.",
    avgSalary: "$100,000",
    demand: "Very High",
    requiredSkills: [
      "Network Security", "Ethical Hacking", "Linux",
      "SIEM Tools", "Python", "Risk Assessment", "Firewalls", "Cryptography"
    ],
    advancedSkills: ["Penetration Testing", "Forensics", "Compliance", "SOC Analysis"],
    color: "#ef4444"
  },
  {
    id: "ux",
    title: "UX/UI Designer",
    icon: "🎨",
    description: "Design intuitive, beautiful digital experiences for users.",
    avgSalary: "$88,000",
    demand: "Moderate",
    requiredSkills: [
      "Figma", "User Research", "Wireframing", "Prototyping",
      "Visual Design", "HTML/CSS", "Usability Testing", "Design Systems"
    ],
    advancedSkills: ["Motion Design", "Information Architecture", "Accessibility", "Front-End Dev"],
    color: "#f59e0b"
  },
  {
    id: "mleng",
    title: "ML Engineer",
    icon: "🤖",
    description: "Build and deploy machine learning models at scale.",
    avgSalary: "$130,000",
    demand: "Very High",
    requiredSkills: [
      "Python", "Machine Learning", "Deep Learning", "TensorFlow/PyTorch",
      "MLOps", "Docker", "SQL", "Statistics"
    ],
    advancedSkills: ["LLMs", "Model Optimization", "Distributed Training", "Feature Stores"],
    color: "#10b981"
  }
];

export const ALL_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust",
  "React", "Vue.js", "Angular", "Node.js", "Django", "Flask", "Spring Boot",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch",
  "HTML/CSS", "REST APIs", "GraphQL", "Git", "Linux", "Docker", "Kubernetes",
  "AWS", "Azure", "GCP", "Terraform", "CI/CD", "Jenkins", "GitHub Actions",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
  "Pandas", "NumPy", "Data Visualization", "Statistics", "R",
  "Network Security", "Ethical Hacking", "Cryptography", "SIEM Tools",
  "Figma", "User Research", "Wireframing", "Prototyping", "Visual Design",
  "Microservices", "System Design", "Algorithms & Data Structures",
  "Agile/Scrum", "Communication", "Problem Solving", "Leadership"
];

export const LEARNING_RESOURCES = [
  {
    id: 1, title: "The Complete JavaScript Course 2024",
    platform: "Udemy", type: "Course", duration: "68h", rating: 4.8,
    url: "#", skills: ["JavaScript", "Node.js", "React"],
    price: "$14.99", level: "Beginner to Advanced"
  },
  {
    id: 2, title: "Machine Learning Specialization",
    platform: "Coursera", type: "Specialization", duration: "3 months", rating: 4.9,
    url: "#", skills: ["Machine Learning", "Python", "TensorFlow"],
    price: "Free audit", level: "Intermediate"
  },
  {
    id: 3, title: "AWS Certified Solutions Architect",
    platform: "A Cloud Guru", type: "Certification Prep", duration: "40h", rating: 4.7,
    url: "#", skills: ["AWS", "Cloud Architecture", "Security"],
    price: "$29/mo", level: "Intermediate"
  },
  {
    id: 4, title: "React - The Complete Guide",
    platform: "Udemy", type: "Course", duration: "48h", rating: 4.7,
    url: "#", skills: ["React", "TypeScript", "Redux"],
    price: "$14.99", level: "Beginner to Advanced"
  },
  {
    id: 5, title: "Data Science Professional Certificate",
    platform: "IBM / Coursera", type: "Certificate", duration: "6 months", rating: 4.6,
    url: "#", skills: ["Python", "SQL", "Data Visualization", "Machine Learning"],
    price: "Free audit", level: "Beginner"
  },
  {
    id: 6, title: "Figma UI UX Design Essentials",
    platform: "Udemy", type: "Course", duration: "15h", rating: 4.7,
    url: "#", skills: ["Figma", "Wireframing", "Prototyping"],
    price: "$14.99", level: "Beginner"
  },
  {
    id: 7, title: "Docker & Kubernetes: The Practical Guide",
    platform: "Udemy", type: "Course", duration: "22h", rating: 4.7,
    url: "#", skills: ["Docker", "Kubernetes", "CI/CD"],
    price: "$14.99", level: "Intermediate"
  },
  {
    id: 8, title: "CS50's Introduction to Computer Science",
    platform: "edX / Harvard", type: "Course", duration: "12 weeks", rating: 4.9,
    url: "#", skills: ["Algorithms & Data Structures", "C++", "Python"],
    price: "Free audit", level: "Beginner"
  },
  {
    id: 9, title: "System Design Interview – Insider Guide",
    platform: "ByteByteGo", type: "Book + Course", duration: "20h", rating: 4.8,
    url: "#", skills: ["System Design", "Microservices", "SQL"],
    price: "$39", level: "Advanced"
  },
  {
    id: 10, title: "Ethical Hacking Bootcamp",
    platform: "TCM Security", type: "Course", duration: "30h", rating: 4.8,
    url: "#", skills: ["Ethical Hacking", "Network Security", "Linux"],
    price: "$29.99", level: "Intermediate"
  }
];

export const PROJECT_IDEAS = [
  {
    id: 1, title: "Personal Portfolio Website",
    difficulty: "Beginner", duration: "1-2 weeks",
    description: "Build a responsive portfolio showcasing your projects with a contact form.",
    skills: ["HTML/CSS", "JavaScript", "React"],
    impact: "Great for job applications",
    category: "fullstack"
  },
  {
    id: 2, title: "Expense Tracker App",
    difficulty: "Beginner", duration: "2-3 weeks",
    description: "Full-stack app with authentication, CRUD operations, and data visualization.",
    skills: ["React", "Node.js", "SQL", "REST APIs"],
    impact: "Shows full-stack ability",
    category: "fullstack"
  },
  {
    id: 3, title: "Customer Churn Prediction Model",
    difficulty: "Intermediate", duration: "2-4 weeks",
    description: "Train ML models on Kaggle telecom datasets to predict churn with 85%+ accuracy.",
    skills: ["Python", "Machine Learning", "Pandas", "Scikit-learn"],
    impact: "High business value",
    category: "datascience"
  },
  {
    id: 4, title: "Real-Time Chat App",
    difficulty: "Intermediate", duration: "3-4 weeks",
    description: "WebSocket-based chat with rooms, auth, and message history.",
    skills: ["React", "Node.js", "WebSockets", "MongoDB"],
    impact: "Shows real-time systems knowledge",
    category: "fullstack"
  },
  {
    id: 5, title: "CI/CD Pipeline for Microservices",
    difficulty: "Advanced", duration: "4-6 weeks",
    description: "Set up GitHub Actions, Docker, and Kubernetes for auto-deploy.",
    skills: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions"],
    impact: "Senior-level credential",
    category: "devops"
  },
  {
    id: 6, title: "Vulnerability Scanner CLI Tool",
    difficulty: "Intermediate", duration: "2-3 weeks",
    description: "Python tool to scan networks for open ports and common vulnerabilities.",
    skills: ["Python", "Network Security", "Linux"],
    impact: "Demonstrates security expertise",
    category: "cybersecurity"
  },
  {
    id: 7, title: "Movie Recommendation System",
    difficulty: "Intermediate", duration: "3-5 weeks",
    description: "Collaborative filtering recommendation engine using MovieLens dataset.",
    skills: ["Python", "Machine Learning", "Pandas", "Data Visualization"],
    impact: "Classic ML showcase",
    category: "datascience"
  },
  {
    id: 8, title: "Design System + Component Library",
    difficulty: "Intermediate", duration: "4-6 weeks",
    description: "Build a reusable Figma design system and corresponding React component library.",
    skills: ["Figma", "React", "Design Systems", "TypeScript"],
    impact: "Shows systematic design thinking",
    category: "ux"
  }
];

export const ADMIN_USERS = [
  {
    id: 1, name: "Alice Johnson", email: "alice@example.com",
    careerGoal: "fullstack", completedSkills: 5, totalSkills: 8,
    joinDate: "2025-08-01", status: "Active", role: "user"
  },
  {
    id: 2, name: "Bob Smith", email: "bob@example.com",
    careerGoal: "datascience", completedSkills: 3, totalSkills: 8,
    joinDate: "2025-09-15", status: "Active", role: "user"
  },
  {
    id: 3, name: "Carol White", email: "carol@example.com",
    careerGoal: "ux", completedSkills: 6, totalSkills: 8,
    joinDate: "2025-07-20", status: "Active", role: "user"
  },
  {
    id: 4, name: "David Lee", email: "david@example.com",
    careerGoal: "devops", completedSkills: 2, totalSkills: 8,
    joinDate: "2025-10-01", status: "Inactive", role: "user"
  },
  {
    id: 5, name: "Emma Davis", email: "emma@example.com",
    careerGoal: "cybersecurity", completedSkills: 7, totalSkills: 8,
    joinDate: "2025-06-10", status: "Active", role: "user"
  }
];
