export interface ProjectionResults {
  health: {
    lifeExpectancyChange: number
    healthyYearsGained: number
    riskFactors: string[]
    benefits: string[]
  }
  climate: {
    annualCO2Footprint: number
    treesEquivalent: number
    carbonSaved: number
    impactDescription: string
  }
  finance: {
    futureValue: number
    totalContributions: number
    interestEarned: number
    monthlyGrowth: number[]
  }
}

export interface UserInputs {
  sleepHours: number
  dietType: string
  exerciseFrequency: string
  commuteType: string
  screenTime: number
  monthlySavings: number
}

// Health projection calculations based on WHO/CDC research
export function calculateHealthProjection(inputs: UserInputs) {
  let lifeExpectancyChange = 0
  let healthyYearsGained = 0
  const riskFactors: string[] = []
  const benefits: string[] = []

  // Sleep impact (7-9 hours optimal)
  if (inputs.sleepHours < 6) {
    lifeExpectancyChange -= 2.5
    riskFactors.push("Insufficient sleep increases disease risk")
  } else if (inputs.sleepHours >= 7 && inputs.sleepHours <= 9) {
    lifeExpectancyChange += 1.5
    healthyYearsGained += 2
    benefits.push("Optimal sleep supports longevity")
  } else if (inputs.sleepHours > 10) {
    lifeExpectancyChange -= 1
    riskFactors.push("Excessive sleep may indicate health issues")
  }

  // Diet impact
  switch (inputs.dietType) {
    case "vegan":
      lifeExpectancyChange += 2
      healthyYearsGained += 3
      benefits.push("Plant-based diet reduces chronic disease risk")
      break
    case "vegetarian":
      lifeExpectancyChange += 1.5
      healthyYearsGained += 2
      benefits.push("Vegetarian diet supports heart health")
      break
    case "omnivore":
      lifeExpectancyChange += 0.5
      healthyYearsGained += 1
      benefits.push("Balanced diet maintains good health")
      break
    case "heavy-meat":
      lifeExpectancyChange -= 1.5
      riskFactors.push("High meat consumption increases cardiovascular risk")
      break
  }

  // Exercise impact
  switch (inputs.exerciseFrequency) {
    case "daily":
      lifeExpectancyChange += 3
      healthyYearsGained += 4
      benefits.push("Daily exercise significantly extends healthy lifespan")
      break
    case "3-5x":
      lifeExpectancyChange += 2
      healthyYearsGained += 3
      benefits.push("Regular exercise boosts longevity")
      break
    case "1-2x":
      lifeExpectancyChange += 1
      healthyYearsGained += 1
      benefits.push("Some exercise is better than none")
      break
    case "none":
      lifeExpectancyChange -= 2
      riskFactors.push("Sedentary lifestyle increases mortality risk")
      break
  }

  // Screen time impact
  if (inputs.screenTime > 10) {
    lifeExpectancyChange -= 1
    riskFactors.push("Excessive screen time affects mental and physical health")
  } else if (inputs.screenTime < 6) {
    lifeExpectancyChange += 0.5
    benefits.push("Moderate screen time supports work-life balance")
  }

  return {
    lifeExpectancyChange: Math.round(lifeExpectancyChange * 10) / 10,
    healthyYearsGained: Math.max(0, Math.round(healthyYearsGained * 10) / 10),
    riskFactors,
    benefits,
  }
}

// Climate projection calculations
export function calculateClimateProjection(inputs: UserInputs) {
  let annualCO2Footprint = 0 // in tons CO2 per year

  // Commute impact (assuming 250 work days per year, 20 miles round trip average)
  switch (inputs.commuteType) {
    case "car":
      annualCO2Footprint = 4.6 // tons CO2/year for average car commute
      break
    case "public-transit":
      annualCO2Footprint = 1.2 // tons CO2/year for public transit
      break
    case "bike":
      annualCO2Footprint = 0.1 // minimal emissions from bike manufacturing
      break
    case "walk":
      annualCO2Footprint = 0.05 // virtually no emissions
      break
    case "remote":
      annualCO2Footprint = 0.8 // home energy use increase
      break
  }

  // Diet impact on carbon footprint
  switch (inputs.dietType) {
    case "heavy-meat":
      annualCO2Footprint += 3.3
      break
    case "omnivore":
      annualCO2Footprint += 2.5
      break
    case "vegetarian":
      annualCO2Footprint += 1.7
      break
    case "vegan":
      annualCO2Footprint += 1.5
      break
  }

  // Screen time impact (device usage and electricity)
  annualCO2Footprint += ((inputs.screenTime * 0.1) / 365) * 365 // rough estimate

  // Calculate trees equivalent (1 tree absorbs ~48 lbs CO2/year = 0.024 tons)
  const treesEquivalent = Math.round(annualCO2Footprint / 0.024)

  // Calculate carbon saved compared to average American (16 tons CO2/year)
  const averageFootprint = 16
  const carbonSaved = averageFootprint - annualCO2Footprint

  let impactDescription = ""
  if (carbonSaved > 5) {
    impactDescription = "Excellent! Your choices significantly reduce environmental impact."
  } else if (carbonSaved > 0) {
    impactDescription = "Good job! You're below average carbon emissions."
  } else if (carbonSaved > -5) {
    impactDescription = "Your footprint is near average. Small changes can make a big difference."
  } else {
    impactDescription = "Consider greener alternatives to reduce your environmental impact."
  }

  return {
    annualCO2Footprint: Math.round(annualCO2Footprint * 10) / 10,
    treesEquivalent,
    carbonSaved: Math.round(carbonSaved * 10) / 10,
    impactDescription,
  }
}

// Financial projection calculations
export function calculateFinancialProjection(inputs: UserInputs) {
  const monthlyAmount = inputs.monthlySavings
  const annualRate = 0.05 // 5% annual return
  const monthlyRate = annualRate / 12
  const years = 25
  const totalMonths = years * 12

  // Calculate future value using compound interest formula
  const futureValue = monthlyAmount * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate)
  const totalContributions = monthlyAmount * totalMonths
  const interestEarned = futureValue - totalContributions

  // Calculate monthly growth for visualization
  const monthlyGrowth: number[] = []
  let currentValue = 0

  for (let month = 1; month <= Math.min(totalMonths, 300); month++) {
    // Cap at 300 for performance
    currentValue = monthlyAmount * (((1 + monthlyRate) ** month - 1) / monthlyRate)
    if (month % 12 === 0 || month <= 12) {
      // Store yearly values + first year monthly
      monthlyGrowth.push(Math.round(currentValue))
    }
  }

  return {
    futureValue: Math.round(futureValue),
    totalContributions: Math.round(totalContributions),
    interestEarned: Math.round(interestEarned),
    monthlyGrowth,
  }
}

// Main simulation function
export function runSimulation(inputs: UserInputs): ProjectionResults {
  return {
    health: calculateHealthProjection(inputs),
    climate: calculateClimateProjection(inputs),
    finance: calculateFinancialProjection(inputs),
  }
}
