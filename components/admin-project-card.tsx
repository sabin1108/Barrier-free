"use client"

import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Star, Github, ExternalLink } from "lucide-react"
import Image from "next/image"

interface AdminProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

export function AdminProjectCard({ project, onEdit, onDelete }: AdminProjectCardProps) {
  return (
    <Card className="overflow-hidden border-border/50">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="relative w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          {project.featured && (
            <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-primary-foreground text-xs">
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold truncate">{project.title}</h3>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="icon" variant="ghost" onClick={onEdit}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onDelete}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 text-xs text-muted-foreground">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Github className="w-3 h-3" />
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <ExternalLink className="w-3 h-3" />
                Live
              </a>
            )}
            <span className="ml-auto">Created {project.createdAt}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
