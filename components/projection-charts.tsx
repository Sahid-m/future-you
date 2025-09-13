"use client"

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Heart, Leaf, DollarSign } from "lucide-react"
import type { ProjectionResults, UserInputs } from "@/lib/simulation-engine"

interface ProjectionChartsProps {
  results: ProjectionResults
  inputs: UserInputs
}

export function ProjectionCharts({ results, inputs }: ProjectionChartsProps) {
  // Generate data points for the next 25 years
  const generateTimelineData = () => {
    const currentYear = new Date().getFullYear()
    const data = []

    for (let i = 0; i <= 25; i++) {
      const year = currentYear + i

      // Health projection (life expectancy improvement over time)
      const healthProgress = Math.min(
        results.health.lifeExpectancyChange,
        results.health.lifeExpectancyChange * (i / 25),
      )
      const currentAge = 30 // Assume starting age of 30
      const lifeExpectancy = 78 + healthProgress // Base life expectancy + improvements

      // Financial projection (compound growth)
      const monthlyContribution = inputs.monthlySavings
      const annualRate = 0.05
      const months = i * 12
      const futureValue = monthlyContribution * (((1 + annualRate / 12) ** months - 1) / (annualRate / 12))

      // Climate impact (cumulative CO2 saved/added)
      const annualCO2 = results.climate.annualCO2Footprint
      const cumulativeCO2 = annualCO2 * i
      const treesEquivalent = Math.round(cumulativeCO2 * 40) // ~40 trees per ton CO2

      data.push({
        year,
        age: currentAge + i,
        lifeExpectancy: Math.round(lifeExpectancy * 10) / 10,
        savings: Math.round(futureValue),
        cumulativeCO2: Math.round(cumulativeCO2 * 10) / 10,
        treesEquivalent: Math.abs(treesEquivalent),
        healthScore: Math.max(0, Math.min(100, 70 + healthProgress * 2)), // Health score out of 100
      })
    }

    return data
  }

  const timelineData = generateTimelineData()

  return (
    <div className="space-y-6">
      {/* Health Timeline */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Health Projection Over Time</CardTitle>
              <CardDescription>Your health trajectory based on current lifestyle choices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "lifeExpectancy" ? `${value} years` : `${value}/100`,
                  name === "lifeExpectancy" ? "Life Expectancy" : "Health Score",
                ]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="lifeExpectancy"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Life Expectancy"
              />
              <Line type="monotone" dataKey="healthScore" stroke="#3b82f6" strokeWidth={2} name="Health Score" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Timeline */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Financial Growth Projection</CardTitle>
              <CardDescription>Compound growth of your ${inputs.monthlySavings}/month savings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Savings Value"]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                name="Total Savings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Climate Impact Timeline */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Environmental Impact Over Time</CardTitle>
              <CardDescription>Cumulative CO₂ footprint and tree equivalents</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData.filter((_, i) => i % 5 === 0)}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(value, name) => [
                  name === "cumulativeCO2" ? `${value} tons` : `${value} trees`,
                  name === "cumulativeCO2" ? "Cumulative CO₂" : "Tree Equivalent",
                ]}
                labelFormatter={(year) => `Year ${year}`}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="cumulativeCO2"
                fill="#ef4444"
                fillOpacity={0.7}
                name="Cumulative CO₂ (tons)"
              />
              <Bar yAxisId="right" dataKey="treesEquivalent" fill="#22c55e" fillOpacity={0.7} name="Trees Equivalent" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-semibold">25-Year Health Gain</span>
          </div>
          <div className="text-2xl font-bold text-primary">+{results.health.lifeExpectancyChange} years</div>
          <div className="text-sm text-muted-foreground">Life expectancy improvement</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="font-semibold">Wealth Accumulation</span>
          </div>
          <div className="text-2xl font-bold text-primary">${results.finance.futureValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total savings value</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold">Environmental Impact</span>
          </div>
          <div className="text-2xl font-bold text-primary">{Math.abs(results.climate.treesEquivalent * 25)} trees</div>
          <div className="text-sm text-muted-foreground">25-year CO₂ equivalent</div>
        </Card>
      </div>
    </div>
  )
}
