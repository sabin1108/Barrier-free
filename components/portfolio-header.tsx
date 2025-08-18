import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export function PortfolioHeader() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-sm text-muted-foreground">Showcasing my best work</p>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href="/admin">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Link>
        </Button>
      </div>
    </header>
  )
}
