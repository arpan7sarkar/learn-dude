"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Clock, Target, TrendingUp } from "lucide-react"

interface ProgressItem {
  id: string
  title: string
  progress: number
  completed: boolean
  timeSpent: number
  estimatedTime: number
  category: string
}

interface ProgressTrackerProps {
  items: ProgressItem[]
  title: string
  description?: string
}

export function ProgressTracker({ items, title, description }: ProgressTrackerProps) {
  const totalProgress = Math.round(items.reduce((sum, item) => sum + item.progress, 0) / items.length)
  const completedItems = items.filter((item) => item.completed).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>{totalProgress}% average progress</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              {completedItems}/{items.length} completed
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <h4 className="font-medium">{item.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {item.timeSpent}h / {item.estimatedTime}h
                  </span>
                </div>
              </div>
              <Progress value={item.progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{item.progress}% complete</span>
                <span>{item.estimatedTime - item.timeSpent}h remaining</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
