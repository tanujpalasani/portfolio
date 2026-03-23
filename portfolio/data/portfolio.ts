export type PortfolioProject = {
  id: string;
  name: string;
  date: string;
  description: string;
  highlights: string[];
  techStack: string[];
  repoUrl: string;
};

export type PortfolioEducation = {
  id: string;
  year: string;
  institution: string;
  location: string;
  degree: string;
  duration: string;
  status: "In Progress" | "Completed";
  scoreLabel: string;
  focusAreas: string[];
  highlights: string[];
};

export type PortfolioCertificate = {
  id: string;
  moduleName: string;
  displayName: string;
  issuer: string;
  issueDate: string;
  status: "verified" | "pending";
  certificateHash: string;
  skills: string[];
  verifyUrl: string;
};

export type PortfolioAchievement = {
  id: string;
  year: string;
  title: string;
  type: "Product" | "AI/ML" | "Career";
  status: "Unlocked" | "In Progress";
  description: string;
  impact: string;
  techStack: string[];
};

export const portfolio = {
  personal: {
    name: "Palasani Sai Venkata Tanuj",
    shortName: "Tanuj",
    role: "Full Stack Developer | ML Engineer",
    location: "Punjab, India",
    email: "tanujpalasani@gmail.com",
    phone: "+91-7981533673",
    github: "https://github.com/tanujpalasani",
    linkedin: "https://www.linkedin.com/in/tanujpalasani/",
    githubHandle: "github.com/tanujpalasani",
    linkedinHandle: "linkedin.com/in/tanujpalasani",
    resumePath: "/tanuj_resume.pdf",
    connections: "500+",
    responseTime: "Usually replies within 24 hours",
    statusLabel: "Open to work",
    summary:
      "B.Tech CSE student focused on full-stack development and machine learning, building practical systems with clear product impact.",
  },
  skills: {
    languages: ["Python", "JavaScript", "C++"],
    web: ["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js"],
    database: ["MongoDB", "MySQL", "SQLite"],
    machineLearning: ["Classification", "Regression", "Clustering", "NLP (Basics)", "Scikit-learn"],
    tools: ["Git", "GitHub", "Postman", "VS Code", "Linux", "Streamlit", "Google Colab"],
    softSkills: ["Leadership", "Communication", "Critical Thinking", "Time Management", "Creativity"],
    coreStack: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "Python", "Scikit-learn"],
  },
  projects: [
    {
      id: "planit",
      name: "PlanIt - Project Management Platform",
      date: "Feb 2026",
      description:
        "Built a full-stack MERN project management system with role-based access control and secure APIs.",
      highlights: [
        "Implemented responsive analytics dashboards using React, Context API, and Tailwind CSS",
        "Designed JWT-based authentication and REST APIs for user/resource management",
        "Structured project workflows for scalable collaboration",
      ],
      techStack: ["React.js", "Node.js", "Express.js", "MongoDB"],
      repoUrl: "https://github.com/tanujpalasani/planit",
    },
    {
      id: "lms-behavior-analytics",
      name: "LMS Student Behavior Analytics Dashboard",
      date: "Nov 2025",
      description:
        "Developed an analytics platform for LMS learner segmentation using unsupervised learning workflows.",
      highlights: [
        "Engineered clustering pipeline with feature scaling and model selection (Elbow/Silhouette)",
        "Trained KMeans, DBSCAN, and GMM models for learner persona generation",
        "Built interactive insights dashboards with Plotly",
      ],
      techStack: ["Python", "Streamlit", "Scikit-learn", "Pandas", "NumPy", "Plotly"],
      repoUrl: "https://github.com/tanujpalasani/lms-learning-analytics-platform",
    },
    {
      id: "vehicle-load-monitoring",
      name: "Vehicle Load Monitoring System",
      date: "May 2025",
      description:
        "Created a vehicle monitoring system using regression and anomaly detection for overload prediction.",
      highlights: [
        "Architected prediction API with validation, processing, and JSON responses",
        "Enabled real-time monitoring with historical trend analysis",
        "Integrated SQLite storage and Chart.js dashboards",
      ],
      techStack: ["Python", "Flask", "Scikit-learn", "SQLite", "Chart.js", "Bootstrap"],
      repoUrl: "https://github.com/tanujpalasani/Vehicle-Load-Monitoring",
    },
  ] as PortfolioProject[],
  education: [
    {
      id: "lpu-btech",
      year: "2027",
      institution: "Lovely Professional University",
      location: "Punjab, India",
      degree: "Bachelor of Technology - Computer Science and Engineering",
      duration: "Aug 2023 - Present",
      status: "In Progress",
      scoreLabel: "CGPA: 8.71",
      focusAreas: ["Full Stack Development", "Machine Learning", "Software Engineering"],
      highlights: [
        "Built product-oriented web and ML systems",
        "Strengthened architecture and system design foundations",
        "Applied engineering practices in hackathons and project work",
      ],
    },
    {
      id: "aditya-intermediate",
      year: "2023",
      institution: "Aditya Junior College",
      location: "Amalapuram, Andhra Pradesh",
      degree: "Intermediate",
      duration: "Jun 2021 - Apr 2023",
      status: "Completed",
      scoreLabel: "Percentage: 92.7",
      focusAreas: ["Mathematics", "Physics", "Analytical Problem Solving"],
      highlights: [
        "Built strong quantitative foundation",
        "Developed disciplined exam and learning strategy",
        "Prepared transition to engineering specialization",
      ],
    },
    {
      id: "srichaitanya-school",
      year: "2021",
      institution: "Sri Chaitanya Techno School",
      location: "Amalapuram, Andhra Pradesh",
      degree: "Matriculation",
      duration: "Jun 2020 - May 2021",
      status: "Completed",
      scoreLabel: "Percentage: 99",
      focusAreas: ["STEM Basics", "Discipline", "Communication"],
      highlights: [
        "Developed strong academic fundamentals",
        "Built consistency and high-performance study habits",
        "Established early interest in computing",
      ],
    },
  ] as PortfolioEducation[],
  certificates: [
    {
      id: "ethical-hacking-nptel",
      moduleName: "nptel.ethical.hacking",
      displayName: "Ethical Hacking",
      issuer: "NPTEL - IIT Kharagpur",
      issueDate: "Nov 2025",
      status: "verified",
      certificateHash: "0xNPTEL-EH-1125-7A2F",
      skills: ["Cybersecurity Basics", "Threat Awareness", "Ethical Security Practices"],
      verifyUrl: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS142S105870121010927250",
    },
    {
      id: "genai-udemy",
      moduleName: "udemy.master.generative.ai",
      displayName: "Master Generative AI & Tools (ChatGPT & More)",
      issuer: "Udemy",
      issueDate: "Aug 2025",
      status: "verified",
      certificateHash: "0xUDEMY-GENAI-0825-9B13",
      skills: ["Prompting", "GenAI Tooling", "AI Workflow Productivity"],
      verifyUrl: "https://www.udemy.com/certificate/UC-7a1a1ff0-67dc-43a7-8947-818148663743/",
    },
    {
      id: "hardware-os-coursera",
      moduleName: "coursera.hardware.os.intro",
      displayName: "Introduction to Hardware and Operating Systems",
      issuer: "Coursera",
      issueDate: "Sep 2024",
      status: "verified",
      certificateHash: "0xCRS-HWOS-0924-5D61",
      skills: ["OS Fundamentals", "Hardware Basics", "System Concepts"],
      verifyUrl: "https://www.coursera.org/account/accomplishments/verify/94PKUIK5VY0N",
    },
    {
      id: "c-pathshala",
      moduleName: "csepathshala.mastering.c",
      displayName: "Mastering in C: Basic to Beyond",
      issuer: "CSE Pathshala",
      issueDate: "Feb 2024",
      status: "verified",
      certificateHash: "0xCSE-C-0224-1F8A",
      skills: ["C Programming", "Memory Concepts", "Problem Solving"],
      verifyUrl: "https://drive.google.com/file/d/17ExeEd4yVAPf0O9OTW1Dypr6962NbIYd/view",
    },
    {
      id: "cipher-ml-ds",
      moduleName: "cipherschools.ml.datascience.training",
      displayName: "Machine Learning with Data Science",
      issuer: "Cipher Schools",
      issueDate: "Jul 2025",
      status: "verified",
      certificateHash: "0xCIPHER-MLDS-0725-4E3C",
      skills: ["EDA", "Regression", "Classification", "Clustering", "Anomaly Detection"],
      verifyUrl: "https://www.cipherschools.com/certificate/preview?id=687f13ff7efd6d509070453e",
    },
  ] as PortfolioCertificate[],
  achievements: [
    {
      id: "patent-chore-scheduler",
      year: "2025",
      title: "Filed patent on AI-based personalized chore scheduling",
      type: "AI/ML",
      status: "Unlocked",
      description:
        "Filed a patent for AI-based personalized chore scheduling with application number 202511067786.",
      impact:
        "Demonstrated innovation capability in applied AI systems and practical automation use-cases.",
      techStack: ["AI Planning", "Machine Learning", "Scheduling Logic"],
    },
    {
      id: "hack-a-throne-runner-up",
      year: "2024",
      title: "Runner-up, Hack-a-Throne 1.0",
      type: "Product",
      status: "Unlocked",
      description:
        "Secured runner-up position in Hack-a-Throne 1.0 organized by GeeksforGeeks.",
      impact:
        "Validated rapid prototyping, solution design, and execution under tight deadlines.",
      techStack: ["Rapid Prototyping", "Full Stack", "Team Collaboration"],
    },
  ] as PortfolioAchievement[],
};
