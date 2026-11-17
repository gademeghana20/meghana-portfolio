import type { PortfolioContent } from "@/types/portfolio";

/**
 * Temporary content source for Phase 2.
 * In Phase 3 this is replaced by published rows from Supabase.
 * Only facts supplied by the owner are included; nothing here is invented.
 */
export const defaultContent: PortfolioContent = {
  profile: {
    name: "Gade Meghana",
    designation: "Software Engineer | Full-Stack Developer | AI/ML Enthusiast",
    headline: "Building Software. Exploring AI. Solving Real-World Problems.",
    intro:
      "I'm Meghana, a Software Engineer passionate about building reliable applications and exploring intelligent technologies.",
    summary: [
      "I'm a Software Engineer at RealPage, where I work on enterprise application development and maintenance using Angular, C#, .NET, REST APIs and SQL Server.",
      "I hold a B.Tech in Artificial Intelligence and Data Science (2026) and have project experience in Python, machine learning, natural language processing, generative AI and computer vision.",
      "I enjoy building scalable software, solving real engineering problems, and exploring how AI can be integrated into practical applications.",
    ],
    careerInterests:
      "Full-stack and backend engineering, and applying AI/ML to practical software products.",
  },
  social: {
    github: "https://github.com/gademeghana20",
    linkedin: "https://www.linkedin.com/in/meghana-gade-a4b734345",
    email: "meghanagade01@gmail.com",
  },
  resumeUrl: null,
  experiences: [
    {
      id: "realpage",
      company: "RealPage",
      role: "Software Developer Intern",
      startDate: "Nov 2025",
      endDate: null,
      responsibilities: [
        "Develop and maintain features in enterprise web applications using Angular and C#/.NET.",
        "Build and integrate REST APIs between front-end and back-end services.",
        "Work with SQL Server, writing and reviewing queries using SQL Server Management Studio.",
        "Debug, test and enhance existing application functionality.",
        "Collaborate through Git/TFS and Azure DevOps workflows.",
      ],
      technologies: [
        "Angular",
        "C#",
        ".NET",
        "REST APIs",
        "SQL Server",
        "Git",
        "Azure DevOps",
      ],
    },
  ],
  education: [
    {
      id: "btech",
      degree: "Bachelor of Technology (B.Tech)",
      specialization: "Artificial Intelligence and Data Science",
      institution: null,
      graduationYear: 2026,
      notes: null,
    },
  ],
  skillCategories: [
    {
      id: "languages",
      title: "Programming Languages",
      icon: "code",
      skills: [
        { name: "C#", level: "professional" },
        { name: "SQL", level: "professional" },
        { name: "TypeScript", level: "professional" },
        { name: "JavaScript", level: "professional" },
        { name: "Python", level: "project" },
      ],
    },
    {
      id: "frontend",
      title: "Frontend Development",
      icon: "layout",
      skills: [
        { name: "Angular", level: "professional" },
        { name: "HTML5", level: "professional" },
        { name: "CSS3", level: "professional" },
        { name: "Responsive Web Design", level: "professional" },
        { name: "React", level: "project" },
      ],
    },
    {
      id: "backend",
      title: "Backend Development",
      icon: "server",
      skills: [
        { name: ".NET", level: "professional" },
        { name: "ASP.NET Core", level: "professional" },
        { name: "REST APIs", level: "professional" },
        { name: "Node.js", level: "familiar" },
        { name: "Express.js", level: "familiar" },
      ],
    },
    {
      id: "databases",
      title: "Databases",
      icon: "database",
      skills: [
        { name: "Microsoft SQL Server", level: "professional" },
        { name: "MongoDB", level: "familiar" },
      ],
    },
    {
      id: "ai-ml",
      title: "AI / Machine Learning",
      icon: "brain",
      skills: [
        { name: "Machine Learning", level: "project" },
        { name: "Computer Vision", level: "project" },
        { name: "Natural Language Processing", level: "project" },
        { name: "Generative AI", level: "familiar" },
        { name: "OpenAI / GPT", level: "familiar" },
        { name: "RAG", level: "familiar" },
        { name: "Semantic Embeddings", level: "familiar" },
      ],
    },
    {
      id: "tools",
      title: "Tools & Technologies",
      icon: "wrench",
      skills: [
        { name: "Git", level: "professional" },
        { name: "GitHub", level: "professional" },
        { name: "Azure DevOps", level: "professional" },
        { name: "Visual Studio", level: "professional" },
        { name: "VS Code", level: "professional" },
        { name: "SQL Server Management Studio", level: "professional" },
        { name: "Postman", level: "professional" },
        { name: "Docker", level: "familiar" },
      ],
    },
  ],
  projects: [
    {
      slug: "resolveiq",
      title: "ResolveIQ",
      shortDescription:
        "An AI-oriented incident management and resolution platform, currently under development.",
      overview:
        "ResolveIQ is an incident management and resolution platform being built with a layered .NET architecture. It is an active work in progress.",
      problem:
        "Incident handling often depends on manual triage and scattered knowledge. ResolveIQ aims to bring incident tracking and resolution together in one place.",
      features: [
        "Feature list will be added as capabilities are implemented and tested.",
      ],
      stack: [
        "C#",
        "ASP.NET Core Web API",
        ".NET 10",
        "Entity Framework Core",
        "SQL Server",
      ],
      contribution: "Designing and building the application end to end.",
      implementation: [
        "Layered architecture separating API, Domain, Infrastructure and Application concerns.",
        "Entity Framework Core for data access against SQL Server.",
      ],
      status: "in-development",
      githubUrl: null,
      liveUrl: null,
      imageUrl: null,
    },
    {
      slug: "license-plate-helmet-detection",
      title: "Dual Detection of License Plates and Helmets Using YOLO & OCR",
      shortDescription:
        "A computer vision project that detects vehicles, license plates and helmet-related violations using YOLO and OCR.",
      overview:
        "A computer vision system that detects vehicles, license plates and helmet usage, and reads plate text using OCR.",
      problem:
        "Manually monitoring helmet compliance and identifying vehicles is slow and error-prone. This project explores automating detection from images and video.",
      features: [
        "Detection of vehicles, license plates and helmet-related violations.",
        "OCR to read license plate text.",
      ],
      stack: ["Python", "YOLO", "OpenCV", "OCR"],
      contribution: "To be confirmed after repository review.",
      implementation: [
        "Model details, results and screenshots will be added after reviewing the repository.",
      ],
      status: "completed",
      githubUrl: null,
      liveUrl: null,
      imageUrl: null,
    },
  ],
  certifications: [],
};
