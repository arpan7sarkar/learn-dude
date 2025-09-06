"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Zap, Flame, BookOpen } from "lucide-react"

interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  xp: number
  level: number
  streak: number
  coursesCompleted: number
  rank: number
}

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("weekly")

  // Mock leaderboard data
  const leaderboardData: Record<string, LeaderboardUser[]> = {
    weekly: [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/diverse-user-avatars.png",
        xp: 1250,
        level: 8,
        streak: 12,
        coursesCompleted: 3,
        rank: 1,
      },
      {
        id: "2",
        name: "Alex Johnson",
        avatar: "/diverse-user-avatars.png",
        xp: 1100,
        level: 7,
        streak: 8,
        coursesCompleted: 2,
        rank: 2,
      },
      {
        id: "3",
        name: "Maria Garcia",
        avatar: "/diverse-user-avatars.png",
        xp: 950,
        level: 6,
        streak: 15,
        coursesCompleted: 2,
        rank: 3,
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "/diverse-user-avatars.png",
        xp: 875,
        level: 6,
        streak: 5,
        coursesCompleted: 1,
        rank: 4,
      },
      {
        id: "5",
        name: "Emma Wilson",
        avatar: "/diverse-user-avatars.png",
        xp: 800,
        level: 5,
        streak: 9,
        coursesCompleted: 1,
        rank: 5,
      },
    ],
    monthly: [
      {
        id: "1",
        name: "Maria Garcia",
        avatar: "/diverse-user-avatars.png",
        xp: 4200,
        level: 12,
        streak: 25,
        coursesCompleted: 8,
        rank: 1,
      },
      {
        id: "2",
        name: "Sarah Chen",
        avatar: "/diverse-user-avatars.png",
        xp: 3800,
        level: 11,
        streak: 18,
        coursesCompleted: 7,
        rank: 2,
      },
      {
        id: "3",
        name: "Alex Johnson",
        avatar: "/diverse-user-avatars.png",
        xp: 3500,
        level: 10,
        streak: 12,
        coursesCompleted: 6,
        rank: 3,
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "/diverse-user-avatars.png",
        xp: 3200,
        level: 9,
        streak: 20,
        coursesCompleted: 5,
        rank: 4,
      },
      {
        id: "5",
        name: "Emma Wilson",
        avatar: "/diverse-user-avatars.png",
        xp: 2900,
        level: 9,
        streak: 14,
        coursesCompleted: 5,
        rank: 5,
      },
    ],
    alltime: [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "/diverse-user-avatars.png",
        xp: 15600,
        level: 18,
        streak: 45,
        coursesCompleted: 25,
        rank: 1,
      },
      {
        id: "2",
        name: "Maria Garcia",
        avatar: "/diverse-user-avatars.png",
        xp: 14200,
        level: 17,
        streak: 38,
        coursesCompleted: 22,
        rank: 2,
      },
      {
        id: "3",
        name: "Alex Johnson",
        avatar: "/diverse-user-avatars.png",
        xp: 12800,
        level: 16,
        streak: 28,
        coursesCompleted: 20,
        rank: 3,
      },
      {
        id: "4",
        name: "David Kim",
        avatar: "/diverse-user-avatars.png",
        xp: 11500,
        level: 15,
        streak: 35,
        coursesCompleted: 18,
        rank: 4,
      },
      {
        id: "5",
        name: "Emma Wilson",
        avatar: "/diverse-user-avatars.png",
        xp: 10200,
        level: 14,
        streak: 22,
        coursesCompleted: 16,
        rank: 5,
      },
    ],
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
        2: "bg-gray-400/20 text-gray-700 border-gray-400/30",
        3: "bg-amber-600/20 text-amber-700 border-amber-600/30",
      }
      return colors[rank as keyof typeof colors]
    }
    return "bg-muted text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>

          {Object.entries(leaderboardData).map(([period, users]) => (
            <TabsContent key={period} value={period} className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    user.rank <= 3 ? getRankBadge(user.rank) : "bg-card hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center justify-center w-8">{getRankIcon(user.rank)}</div>

                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Zap className="h-3 w-3" />
                          {user.xp.toLocaleString()} XP
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Flame className="h-3 w-3" />
                          {user.streak} day streak
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          {user.coursesCompleted} courses
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    Level {user.level}
                  </Badge>
                </div>
              ))}

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">Keep learning to climb the leaderboard!</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
