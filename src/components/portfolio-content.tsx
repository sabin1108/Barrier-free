"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/project-card"
import { PortfolioHeader } from "@/components/portfolio-header"
import { PortfolioFilter } from "@/components/portfolio-filter"
import type { Project } from "@/lib/types"

export function PortfolioContent({ projects, profile }: { projects: Project[], profile?: { headline: string, bio: string } | null }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) return projects
    return projects.filter((project) => selectedTags.some((tag) => project.tags.includes(tag)))
  }, [projects, selectedTags])

  const featuredProjects = filteredProjects.filter((p) => p.featured)
  const otherProjects = filteredProjects.filter((p) => !p.featured)

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="min-h-screen bg-background">
      <PortfolioHeader />

      <main className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 sm:mb-24 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-balance bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {profile?.headline || "Building digital experiences that matter."}
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto text-pretty leading-relaxed">
              {profile?.bio || "A collection of my professional projects, experiments, and open-source contributions. Crafted with attention to detail and user experience."}
            </p>
          </div>

          <PortfolioFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={() => setSelectedTags([])}
          />

          {featuredProjects.length > 0 && (
            <section className="mb-16 sm:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-backwards">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Projects</h3>
                <div className="h-px flex-1 bg-border/60"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {otherProjects.length > 0 && (
            <section>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                {featuredProjects.length > 0 ? "All Projects" : "Projects"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {otherProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No projects found matching the selected tags.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
