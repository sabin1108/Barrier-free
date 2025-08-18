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
