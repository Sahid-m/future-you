import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { dbStore } from "@/lib/memory-store"
import { ArrowLeft, BookOpen, DollarSign, Heart, Leaf } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function SharedResultsPage({ params }: { params: { id: string } }) {

  console.log(dbStore.getAllSharedResult());
  const sharedResult = await dbStore.getSharedResult(params.id)

  if (!sharedResult) {
    notFound()
  }

  const { inputs, results, aiStory } = sharedResult

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">Shared Future Projection</h1>
          <p className="text-lg text-muted-foreground mb-6">Someone shared their lifestyle projection with you</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Create Your Own Projection
            </Button>
          </Link>
        </div>

        {/* Lifestyle Summary */}
        <Card className="max-w-2xl mx-auto mb-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Lifestyle Choices</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Sleep:</span> {inputs.sleepHours} hours/night
            </div>
            <div>
              <span className="font-medium">Diet:</span> {inputs.dietType}
            </div>
            <div>
              <span className="font-medium">Exercise:</span> {inputs.exerciseFrequency}
            </div>
            <div>
              <span className="font-medium">Commute:</span> {inputs.commuteType}
            </div>
            <div>
              <span className="font-medium">Screen Time:</span> {inputs.screenTime} hours/day
            </div>
            <div>
              <span className="font-medium">Monthly Savings:</span> ${inputs.monthlySavings}
            </div>
          </div>
        </Card>

        {/* AI Story */}
        {aiStory && (
          <Card className="max-w-4xl mx-auto mb-8 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Their Future Story</h3>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                <p className="text-foreground leading-relaxed whitespace-pre-line">{aiStory}</p>
              </div>
            </div>
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
                    {results.health.benefits.map((benefit: string, i: number) => (
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
                    {results.health.riskFactors.map((risk: string, i: number) => (
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
                Their footprint: {results.climate.annualCO2Footprint} tons CO₂/year
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
                  <div className="text-xs text-muted-foreground">Their contributions</div>
                </div>
                <div className="p-2 bg-accent/10 rounded">
                  <div className="font-medium">${results.finance.interestEarned.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Interest earned</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Assuming 5% annual return with monthly contributions</div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto p-6">
            <h3 className="text-xl font-semibold mb-3">Want to See Your Own Future?</h3>
            <p className="text-muted-foreground mb-4">
              Create your own personalized projection and discover how your lifestyle choices shape your future.
            </p>
            <Link href="/">
              <Button>Create My Projection</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
