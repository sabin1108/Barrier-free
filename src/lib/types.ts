// Database Types
export interface DBProject {
  id: string
  title: string
  description: string
  image_url: string | null
  github_url: string | null
  live_url: string | null
  tags: string[]
  featured: boolean
  user_id: string
  created_at: Date
  updated_at: Date
}

export interface User {
  id: string
  email: string
  name: string | null
  created_at: Date
}

// Frontend Types
export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  createdAt: string
  featured: boolean
}

export interface ProjectFormData {
  title: string
  description: string
  imageUrl: string
  githubUrl?: string
  liveUrl?: string
  tags: string[]
  featured: boolean
}
