"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, X, Sparkles } from "lucide-react"
import type { Achievement } from "@/lib/achievements"

interface AchievementNotificationProps {
  achievement: Achievement
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const rarityColors = {
    common: "bg-slate-500/20 border-slate-500/30 text-slate-700 dark:text-slate-300",
    rare: "bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300",
    epic: "bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300",
    legendary: "bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300",
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <Card className={`w-80 ${rarityColors[achievement.rarity]} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-background/50 rounded-full">
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                {achievement.rarity === "legendary" && (
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Trophy className="h-3 w-3" />
                  Achievement Unlocked!
                </h3>
                <p className="font-medium text-sm">{achievement.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{achievement.description}</p>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className={`text-xs ${rarityColors[achievement.rarity]}`}>
                {achievement.rarity.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                +{achievement.reward.xp} XP
              </Badge>
            </div>

            {achievement.reward.badge && (
              <div className="p-2 bg-background/30 rounded border border-border/50">
                <p className="text-xs font-medium">Special Badge Earned:</p>
                <p className="text-xs text-muted-foreground capitalize">{achievement.reward.badge.replace("_", " ")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
