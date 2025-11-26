import type { Project } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-muted/50">
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {project.featured && (
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-foreground text-[10px] font-medium shadow-sm border border-border/50">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            Featured
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/50 hover:bg-secondary border-transparent">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-secondary/50 border-transparent">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-balance group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <div className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>

        <div className="flex items-center gap-3 mt-auto">
          {project.liveUrl && (
            <Button size="sm" asChild className="flex-1 rounded-full shadow-sm hover:shadow-md transition-all">
              <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-2" />
                Visit Site
              </Link>
            </Button>
          )}

          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild className="flex-1 rounded-full bg-transparent border-border/60 hover:bg-secondary/50">
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="w-3.5 h-3.5 mr-2" />
                Source
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
