"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Trophy, Star, X } from "lucide-react"
import type { XPReward, UserLevel } from "@/lib/xp-system"

interface XPNotificationProps {
  reward: XPReward
  newXP: number
  levelUp?: boolean
  newLevel?: UserLevel
  onClose: () => void
}

export function XPNotification({ reward, newXP, levelUp, newLevel, onClose }: XPNotificationProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onClose, 300)
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <Card className="w-80 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">XP Earned!</h3>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                +{reward.points} XP
              </Badge>
              <span className="text-xs text-muted-foreground">Total: {newXP} XP</span>
            </div>

            {levelUp && newLevel && (
              <div className="p-3 bg-gradient-to-r from-chart-5/20 to-chart-1/20 rounded-lg border border-chart-5/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-chart-5" />
                  <span className="font-semibold text-sm">Level Up!</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-chart-5" />
                  <span className="text-xs">
                    Level {newLevel.level} - {newLevel.title}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">New benefits unlocked:</p>
                  <ul className="text-xs text-muted-foreground mt-1">
                    {newLevel.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
