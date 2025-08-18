import { getProjects } from "@/lib/projects-db"
import { PortfolioContent } from "@/components/portfolio-content"

export default async function HomePage() {
  const projects = await getProjects()

  return <PortfolioContent projects={projects} />
}
