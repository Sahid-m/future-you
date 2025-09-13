"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Plus, Check, X } from "lucide-react"

type Goal = {
  id: string
  category: "Health" | "Climate" | "Finance" | "Lifestyle"
  title: string
  target: string
  progress: number
  completed: boolean
}

export function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      category: "Health",
      title: "Sleep 8 hours nightly",
      target: "8 hours",
      progress: 75,
      completed: false,
    },
    {
      id: "2",
      category: "Finance",
      title: "Save $1000/month",
      target: "$1000",
      progress: 60,
      completed: false,
    },
  ])

  const [newGoal, setNewGoal] = useState({ title: "", target: "", category: "Health" as Goal["category"] })
  const [showAddGoal, setShowAddGoal] = useState(false)

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return

    const goal: Goal = {
      id: Date.now().toString(),
      category: newGoal.category,
      title: newGoal.title,
      target: newGoal.target,
      progress: 0,
      completed: false,
    }

    setGoals((prev) => [...prev, goal])
    setNewGoal({ title: "", target: "", category: "Health" })
    setShowAddGoal(false)
  }

  const updateProgress = (id: string, progress: number) => {
    setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, progress, completed: progress >= 100 } : goal)))
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  const getCategoryColor = (category: Goal["category"]) => {
    switch (category) {
      case "Health":
        return "bg-red-100 text-red-800"
      case "Climate":
        return "bg-green-100 text-green-800"
      case "Finance":
        return "bg-blue-100 text-blue-800"
      case "Lifestyle":
        return "bg-purple-100 text-purple-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Personal Goals</CardTitle>
          </div>
          <Button size="sm" onClick={() => setShowAddGoal(!showAddGoal)} variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddGoal && (
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  placeholder="Target (e.g., 8 hours, $1000)"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, target: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                {(["Health", "Climate", "Finance", "Lifestyle"] as const).map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={newGoal.category === cat ? "default" : "outline"}
                    onClick={() => setNewGoal((prev) => ({ ...prev, category: cat }))}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addGoal}>
                  Add Goal
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {goals.map((goal) => (
          <div key={goal.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                <span className="font-medium">{goal.title}</span>
                {goal.completed && <Check className="h-4 w-4 text-green-600" />}
              </div>
              <Button size="sm" variant="ghost" onClick={() => deleteGoal(goal.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>
                  {goal.progress}% to {goal.target}
                </span>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateProgress(goal.id, Math.min(100, goal.progress + 10))}
                >
                  +10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateProgress(goal.id, Math.max(0, goal.progress - 10))}
                >
                  -10%
                </Button>
              </div>
            </div>
          </div>
        ))}

        {goals.length === 0 && !showAddGoal && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No goals set yet. Add your first goal to start tracking progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
