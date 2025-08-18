"use client"

import { useState, useMemo } from "react"
import { ProjectCard } from "@/components/project-card"
import { PortfolioHeader } from "@/components/portfolio-header"
import { PortfolioFilter } from "@/components/portfolio-filter"
import type { Project } from "@/lib/types"

export function PortfolioContent({ projects }: { projects: Project[] }) {
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

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-balance">Projects & Work</h2>
            <p className="text-muted-foreground text-base sm:text-lg text-pretty leading-relaxed">
              A collection of my professional projects, experiments, and open-source contributions
            </p>
          </div>

          <PortfolioFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearAll={() => setSelectedTags([])}
          />

          {featuredProjects.length > 0 && (
            <section className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Featured Projects</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
