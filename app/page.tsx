"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Heart,
  Leaf,
  DollarSign,
  BookOpen,
  Plus,
  ArrowLeftRight,
  Trash2,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { runSimulation, type UserInputs, type ProjectionResults } from "@/lib/simulation-engine"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingCard } from "@/components/floating-card"
import { InteractiveButton } from "@/components/interactive-button"
import { GoalTracker } from "@/components/goal-tracker"
import { Badge } from "@/components/ui/badge"
import { ProjectionCharts } from "@/components/projection-charts"

type Scenario = {
  id: string
  name: string
  inputs: UserInputs
  results: ProjectionResults
  aiStory?: string
}

export default function FutureYouSimulator() {
  const [inputs, setInputs] = useState<UserInputs>({
    sleepHours: 7,
    dietType: "",
    exerciseFrequency: "",
    commuteType: "",
    screenTime: 8,
    monthlySavings: 500,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<ProjectionResults | null>(null)
  const [aiStory, setAiStory] = useState<string | null>(null)
  const [storyLoading, setStoryLoading] = useState(false)
  const [storyError, setStoryError] = useState<string | null>(null)

  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [scenarioName, setScenarioName] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [showGoalTracker, setShowGoalTracker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate some processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const projectionResults = runSimulation(inputs)
      setResults(projectionResults)
      console.log("Simulation results:", projectionResults)

      await Promise.all([generateAIStory(projectionResults, inputs), generateAISuggestions(projectionResults, inputs)])
    } catch (error) {
      console.error("Simulation failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIStory = async (projections: ProjectionResults, formData: UserInputs) => {
    setStoryLoading(true)
    setStoryError(null)

    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projections,
          formData: {
            sleep: formData.sleepHours,
            diet: formData.dietType,
            exercise: formData.exerciseFrequency,
            commute: formData.commuteType,
            screenTime: formData.screenTime,
            savings: formData.monthlySavings,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate story")
      }

      const data = await response.json()
      setAiStory(data.story)
    } catch (error) {
      console.error("Error generating story:", error)
      setStoryError("Unable to generate your personalized story. Please check that GEMINI_API_KEY is configured.")
    } finally {
      setStoryLoading(false)
    }
  }

  const generateAISuggestions = async (projections: ProjectionResults, formData: UserInputs) => {
    setSuggestionsLoading(true)

    try {
      const response = await fetch("/api/generate-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            sleep: formData.sleepHours,
            diet: formData.dietType,
            exercise: formData.exerciseFrequency,
            commute: formData.commuteType,
            screenTime: formData.screenTime,
            savings: formData.monthlySavings,
          },
          results: projections,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error("Error generating suggestions:", error)
    } finally {
      setSuggestionsLoading(false)
    }
  }

  const saveAsScenario = async () => {
    if (!results || !scenarioName.trim()) return

    try {
      const response = await fetch("/api/save-scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: scenarioName.trim(),
          inputs,
          results,
          aiStory,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Scenario saved successfully:", data.scenarioId)

        // Add to local state for immediate UI update
        const newScenario: Scenario = {
          id: data.scenarioId,
          name: scenarioName.trim(),
          inputs: { ...inputs },
          results: { ...results },
          aiStory: aiStory || undefined,
        }
        setScenarios((prev) => [...prev, newScenario])
        setScenarioName("")
      } else {
        console.error("[v0] Failed to save scenario")
      }
    } catch (error) {
      console.error("[v0] Error saving scenario:", error)
    }
  }

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id))
  }

  const loadScenario = (scenario: Scenario) => {
    setInputs(scenario.inputs)
    setResults(scenario.results)
    setAiStory(scenario.aiStory || null)
    setShowComparison(false)
  }

  const updateInput = (field: keyof UserInputs, value: string | number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const resetSimulation = () => {
    setResults(null)
    setAiStory(null)
    setStoryError(null)
    setShowComparison(false)
    setShareUrl(null)
    setAiSuggestions([])
  }

  const shareResults = async () => {
    if (!results) return

    setIsSharing(true)
    try {
      const response = await fetch("/api/share-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs,
          results,
          aiStory,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShareUrl(data.shareUrl)
        console.log("[v0] Results shared successfully:", data.shareUrl)

        // Copy to clipboard
        await navigator.clipboard.writeText(data.shareUrl)
        alert("Share link copied to clipboard!")
      } else {
        console.error("[v0] Failed to share results")
        alert("Failed to create share link")
      }
    } catch (error) {
      console.error("[v0] Error sharing results:", error)
      alert("Failed to create share link")
    } finally {
      setIsSharing(false)
    }
  }

  const ComparisonView = () => (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">Scenario Comparison</h1>
          <p className="text-lg text-muted-foreground mb-6">Compare different lifestyle choices side by side</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setShowComparison(false)} variant="outline">
              Back to Results
            </Button>
            <Button onClick={resetSimulation}>Create New Scenario</Button>
          </div>
        </div>

        {scenarios.length === 0 ? (
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h3 className="text-xl font-semibold mb-3">No Scenarios to Compare</h3>
            <p className="text-muted-foreground mb-4">
              Save your current results as a scenario, then create different lifestyle choices to compare them.
            </p>
            <Button onClick={() => setShowComparison(false)}>Go Back to Results</Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{scenario.name}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => loadScenario(scenario)}>
                      Load Scenario
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteScenario(scenario.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  {/* Lifestyle Summary */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Lifestyle</h4>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <div>Sleep: {scenario.inputs.sleepHours}h</div>
                      <div>Diet: {scenario.inputs.dietType}</div>
                      <div>Exercise: {scenario.inputs.exerciseFrequency}</div>
                      <div>Commute: {scenario.inputs.commuteType}</div>
                      <div>Screen: {scenario.inputs.screenTime}h</div>
                      <div>Savings: ${scenario.inputs.monthlySavings}</div>
                    </div>
                  </div>

                  {/* Health Results */}
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-primary">
                      {scenario.results.health.lifeExpectancyChange > 0 ? "+" : ""}
                      {scenario.results.health.lifeExpectancyChange} years
                    </div>
                    <div className="text-xs text-muted-foreground">Life expectancy</div>
                  </div>

                  {/* Climate Results */}
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <Leaf className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-primary">
                      {scenario.results.climate.treesEquivalent} trees
                    </div>
                    <div className="text-xs text-muted-foreground">CO₂ equivalent</div>
                  </div>

                  {/* Financial Results */}
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-primary">
                      ${scenario.results.finance.futureValue.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Future value</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  if (showComparison) {
    return <ComparisonView />
  }

  if (results) {
    return (
      <div className="min-h-screen bg-background relative">
        <AnimatedBackground />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
              Your Future Projection
            </h1>
            <p className="text-lg text-muted-foreground mb-6 font-light">Based on your current lifestyle choices</p>
            <div className="flex gap-3 justify-center mb-8 flex-wrap">
              <Button onClick={resetSimulation} variant="outline" className="bg-transparent">
                Try Different Choices
              </Button>
              {scenarios.length > 0 && (
                <Button onClick={() => setShowComparison(true)} variant="outline">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  Compare Scenarios ({scenarios.length})
                </Button>
              )}
              <Button onClick={() => setShowGoalTracker(!showGoalTracker)} variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                {showGoalTracker ? "Hide" : "Show"} Goals
              </Button>
            </div>
          </div>

          {showGoalTracker && (
            <div className="max-w-4xl mx-auto mb-8">
              <GoalTracker />
            </div>
          )}

          <FloatingCard className="max-w-2xl mx-auto mb-8 p-4 shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Name this scenario (e.g., 'Current Lifestyle', 'Healthier Me')"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300"
              />
              <Button onClick={saveAsScenario} disabled={!scenarioName.trim()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
            </div>
          </FloatingCard>

          {/* Projection Charts */}
          <div className="max-w-6xl mx-auto mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-semibold">Future Life Data Visualization</h3>
                  <p className="text-muted-foreground">Interactive charts showing your projected life trajectory</p>
                </div>
              </div>
              <ProjectionCharts results={results} inputs={inputs} />
            </Card>
          </div>

          {(aiSuggestions.length > 0 || suggestionsLoading) && (
            <Card className="max-w-4xl mx-auto mb-8 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">AI-Powered Improvement Suggestions</h3>
              </div>

              {suggestionsLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span className="text-muted-foreground">
                    AI is analyzing your lifestyle for personalized suggestions...
                  </span>
                </div>
              )}

              {aiSuggestions.length > 0 && (
                <div className="grid gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{suggestion.category}</Badge>
                        <h4 className="font-semibold">{suggestion.suggestion}</h4>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {(aiStory || storyLoading || storyError) && (
            <Card className="max-w-4xl mx-auto mb-8 p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Your Future Story</h3>
              </div>

              {storyLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                  <span className="text-muted-foreground">AI is crafting your personalized future story...</span>
                </div>
              )}

              {storyError && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{storyError}</p>
                </div>
              )}

              {aiStory && (
                <div className="prose prose-lg max-w-none">
                  <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">{aiStory}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Results Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Health Results */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Health Impact</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results.health.lifeExpectancyChange > 0 ? "+" : ""}
                    {results.health.lifeExpectancyChange} years
                  </div>
                  <div className="text-sm text-muted-foreground">Life expectancy change</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-lg font-semibold text-accent-foreground">
                    +{results.health.healthyYearsGained} healthy years
                  </div>
                </div>
                {results.health.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                    <ul className="text-sm space-y-1">
                      {results.health.benefits.map((benefit, i) => (
                        <li key={i} className="text-green-600">
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.health.riskFactors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Risk Factors:</h4>
                    <ul className="text-sm space-y-1">
                      {results.health.riskFactors.map((risk, i) => (
                        <li key={i} className="text-orange-600">
                          • {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Climate Results */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Climate Impact</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{results.climate.treesEquivalent} trees</div>
                  <div className="text-sm text-muted-foreground">Annual CO₂ equivalent</div>
                </div>
                <div className="text-center p-3 bg-accent/10 rounded-lg">
                  <div className="text-lg font-semibold">
                    {results.climate.carbonSaved > 0
                      ? `${results.climate.carbonSaved} tons saved`
                      : `${Math.abs(results.climate.carbonSaved)} tons over average`}
                  </div>
                </div>
                <div className="text-sm p-3 bg-muted rounded-lg">
                  <p>{results.climate.impactDescription}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Your footprint: {results.climate.annualCO2Footprint} tons CO₂/year
                </div>
              </div>
            </Card>

            {/* Financial Results */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold">Financial Future</h3>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">${results.finance.futureValue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total value in 25 years</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">${results.finance.totalContributions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Your contributions</div>
                  </div>
                  <div className="p-2 bg-accent/10 rounded">
                    <div className="font-medium">${results.finance.interestEarned.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Interest earned</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Assuming 5% annual return with monthly contributions
                </div>
              </div>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto p-6">
              <h3 className="text-xl font-semibold mb-3">Ready to Shape Your Future?</h3>
              <p className="text-muted-foreground mb-4">
                Small changes in your daily habits can lead to significant improvements in your health, environmental
                impact, and financial security.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={resetSimulation}>Adjust My Choices</Button>
                <Button variant="outline" onClick={shareResults} disabled={isSharing}>
                  {isSharing ? "Creating Link..." : "Share My Results"}
                </Button>
                <Button variant="outline" onClick={() => setShowGoalTracker(true)}>
                  Set Goals
                </Button>
              </div>
              {shareUrl && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Share this link:</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded break-all">{shareUrl}</code>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full animate-float animate-glow">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
            Future You
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground text-balance mb-4 font-light">
            See the Life Your Choices Create
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Health, Climate, and Finance projections made personal. Discover how your daily habits shape your future
            self with AI-powered insights.
          </p>
        </div>

        {/* Input Form */}
        <FloatingCard className="max-w-2xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-primary animate-pulse" />
              Tell Us About Your Lifestyle
            </CardTitle>
            <CardDescription className="text-base">
              Answer a few questions to see your projected future in 2050
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sleep Hours */}
              <div className="space-y-2">
                <Label htmlFor="sleep" className="text-sm font-medium">
                  Sleep hours per night
                </Label>
                <Input
                  id="sleep"
                  type="number"
                  min="4"
                  max="12"
                  step="0.5"
                  value={inputs.sleepHours}
                  onChange={(e) => updateInput("sleepHours", Number.parseFloat(e.target.value))}
                  className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              {/* Diet Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Diet type</Label>
                <Select value={inputs.dietType} onValueChange={(value) => updateInput("dietType", value)}>
                  <SelectTrigger className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder="Select your diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">🥗 Vegetarian</SelectItem>
                    <SelectItem value="vegan">🌱 Vegan</SelectItem>
                    <SelectItem value="omnivore">🍽️ Omnivore (Balanced)</SelectItem>
                    <SelectItem value="heavy-meat">🥩 Heavy Meat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exercise Frequency */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Exercise frequency</Label>
                <Select
                  value={inputs.exerciseFrequency}
                  onValueChange={(value) => updateInput("exerciseFrequency", value)}
                >
                  <SelectTrigger className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder="How often do you exercise?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">😴 None</SelectItem>
                    <SelectItem value="1-2x">🚶 1-2x per week</SelectItem>
                    <SelectItem value="3-5x">🏃 3-5x per week</SelectItem>
                    <SelectItem value="daily">💪 Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Commute Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Commute type</Label>
                <Select value={inputs.commuteType} onValueChange={(value) => updateInput("commuteType", value)}>
                  <SelectTrigger className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300">
                    <SelectValue placeholder="How do you get to work?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Car</SelectItem>
                    <SelectItem value="public-transit">🚌 Public Transit</SelectItem>
                    <SelectItem value="bike">🚴 Bike</SelectItem>
                    <SelectItem value="walk">🚶 Walk</SelectItem>
                    <SelectItem value="remote">🏠 Remote Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <Label htmlFor="screen-time" className="text-sm font-medium">
                  Daily screen time (hours)
                </Label>
                <Input
                  id="screen-time"
                  type="number"
                  min="1"
                  max="16"
                  step="0.5"
                  value={inputs.screenTime}
                  onChange={(e) => updateInput("screenTime", Number.parseFloat(e.target.value))}
                  className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              {/* Monthly Savings */}
              <div className="space-y-2">
                <Label htmlFor="savings" className="text-sm font-medium">
                  Monthly savings amount ($)
                </Label>
                <Input
                  id="savings"
                  type="number"
                  min="0"
                  step="50"
                  value={inputs.monthlySavings}
                  onChange={(e) => updateInput("monthlySavings", Number.parseFloat(e.target.value))}
                  className="text-lg h-12 border-2 focus:border-primary/50 transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <InteractiveButton
                type="submit"
                className="w-full text-lg py-6 h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={isLoading || !inputs.dietType || !inputs.exerciseFrequency || !inputs.commuteType}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    Generating Your Future...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate My Future
                  </div>
                )}
              </InteractiveButton>
            </form>
          </CardContent>
        </FloatingCard>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <FloatingCard className="text-center p-6 bg-card/60 backdrop-blur-sm border-0" delay={100}>
            <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4 animate-float">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Health Projection</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              See how your sleep, diet, and exercise impact your life expectancy with personalized insights
            </p>
          </FloatingCard>

          <FloatingCard className="text-center p-6 bg-card/60 backdrop-blur-sm border-0" delay={200}>
            <div
              className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-4 animate-float"
              style={{ animationDelay: "0.5s" }}
            >
              <Leaf className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Climate Impact</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calculate your carbon footprint and environmental contribution with real-world data
            </p>
          </FloatingCard>

          <FloatingCard className="text-center p-6 bg-card/60 backdrop-blur-sm border-0" delay={300}>
            <div
              className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Financial Future</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Project your savings growth with compound interest calculations over 25 years
            </p>
          </FloatingCard>
        </div>
      </div>
    </div>
  )
}
