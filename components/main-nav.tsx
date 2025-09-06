"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Home, BookOpen, Plus, Trophy, BarChart3, User, Brain, Target, Users, Zap } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Your learning overview",
  },
  {
    name: "Courses",
    href: "/courses",
    icon: BookOpen,
    description: "Browse and manage courses",
  },
  {
    name: "Create",
    href: "/create",
    icon: Plus,
    description: "Generate new AI courses",
  },
  {
    name: "Challenges",
    href: "/gamification",
    icon: Trophy,
    description: "Daily challenges and leaderboard",
    badge: "New",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Learning insights and progress",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    description: "Your profile and achievements",
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-bold">LearnAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <div className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 px-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-primary" />
                    <span>XP</span>
                  </div>
                  <span className="font-medium">2,450</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-destructive" />
                    <span>Streak</span>
                  </div>
                  <span className="font-medium">7 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-3 w-3 text-amber-500" />
                    <span>Level</span>
                  </div>
                  <span className="font-medium">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Users className="h-4 w-4 mr-2" />
            Join Community
          </Button>
        </div>
      </div>
    </nav>
  )
}
