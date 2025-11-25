import type { Project } from "./types"

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description:
      "A full-stack e-commerce platform built with Next.js, featuring product management, shopping cart, and payment integration.",
    imageUrl: "/modern-ecommerce-interface.png",
    githubUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://ecommerce-demo.vercel.app",
    tags: ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
    createdAt: "2024-01-15",
    featured: true,
  },
  {
    id: "2",
    title: "AI Chat Application",
    description:
      "Real-time chat application with AI-powered responses using OpenAI API, built with React and WebSocket.",
    imageUrl: "/modern-chat-app.png",
    githubUrl: "https://github.com/example/ai-chat",
    liveUrl: "https://ai-chat-demo.vercel.app",
    tags: ["React", "AI", "WebSocket", "Node.js"],
    createdAt: "2024-02-20",
    featured: true,
  },
  {
    id: "3",
    title: "Portfolio Analytics Dashboard",
    description:
      "Analytics dashboard for tracking portfolio performance with interactive charts and real-time data visualization.",
    imageUrl: "/analytics-dashboard.png",
    githubUrl: "https://github.com/example/analytics",
    tags: ["Next.js", "Charts", "Data Visualization", "PostgreSQL"],
    createdAt: "2024-03-10",
    featured: false,
  },
]
