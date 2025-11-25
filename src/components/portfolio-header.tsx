import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export function PortfolioHeader() {
  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl bg-background/70 backdrop-blur-md border border-border/40 rounded-full shadow-sm supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">P</span>
            </div>
            <span className="font-semibold tracking-tight">Portfolio</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Projects</Link>
            <Link href="#" className="hover:text-foreground transition-colors">About</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-primary/5">
              <Link href="/admin">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
