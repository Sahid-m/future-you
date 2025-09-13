# Future You – Life Projection Simulator

A modern web application that projects your future life based on current lifestyle choices, combining health, climate, and financial data with AI-powered storytelling and personalized recommendations.

## 🌟 Features

### Core Functionality
- **Life Projection Engine**: Advanced algorithms calculate health, climate, and financial projections based on user inputs
- **AI Storytelling**: Gemini AI generates personalized narratives about your future self in 2049
- **Interactive Visualizations**: Dynamic charts showing 25-year projections and trends
- **Scenario Comparison**: Save and compare different lifestyle choices side by side
- **Goal Tracking**: Set personal improvement targets with progress monitoring

### Health Projections
- Life expectancy calculations based on sleep, diet, and exercise habits
- Health score tracking over time
- Personalized benefits and risk factor analysis
- Research-based multipliers for lifestyle impacts

### Climate Impact Analysis
- Annual CO₂ footprint calculation from commute and lifestyle choices
- Tree equivalent visualizations for environmental impact
- Cumulative environmental impact over 25 years
- Actionable climate improvement suggestions

### Financial Modeling
- Compound interest calculations for savings growth
- 25-year wealth accumulation projections
- Monthly contribution tracking
- Investment growth visualizations

### AI-Powered Features
- **Personalized Stories**: Gemini AI crafts engaging narratives about your future life
- **Smart Suggestions**: AI analyzes your lifestyle and provides improvement recommendations
- **Goal Setting**: Intelligent goal suggestions based on your current habits

### User Experience
- **Modern Design**: Animated backgrounds, floating cards, and interactive elements
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Real-time Updates**: Instant feedback and dynamic visualizations
- **Share Results**: Generate shareable links for your projections

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components, custom animations
- **Charts**: Recharts for data visualization
- **AI Integration**: Google Gemini API for storytelling and suggestions
- **State Management**: React hooks and context
- **Data Storage**: In-memory storage for scenarios and shared results

## 📊 Data Sources & Calculations

### Health Calculations
- Sleep impact: Based on sleep research showing optimal 7-9 hours
- Diet multipliers: Vegetarian/vegan (+2-3 years), balanced diet (+1 year)
- Exercise benefits: Regular exercise adds 3-7 years to life expectancy
- Screen time effects: Excessive screen time reduces life expectancy

### Climate Data
- Commute CO₂ emissions: Real-world data for different transportation methods
- Diet carbon footprint: Meat consumption vs. plant-based diets
- Tree equivalents: ~40 trees needed to offset 1 ton of CO₂ annually

### Financial Projections
- Compound interest formula: A = P(1 + r/n)^(nt)
- Assumed 5% annual return (conservative market average)
- Monthly contribution compounding

## 🎯 Key Components

### Core Components
- `app/page.tsx` - Main application with form and results display
- `lib/simulation-engine.ts` - Core calculation logic for all projections
- `components/projection-charts.tsx` - Interactive data visualizations
- `components/goal-tracker.tsx` - Goal setting and progress monitoring

### UI Components
- `components/animated-background.tsx` - Dynamic background with floating orbs
- `components/floating-card.tsx` - Animated card components
- `components/interactive-button.tsx` - Enhanced button with hover effects

### API Routes
- `app/api/generate-story/route.ts` - Gemini AI story generation
- `app/api/generate-suggestions/route.ts` - AI-powered improvement suggestions
- `app/api/share-results/route.ts` - Create shareable result links
- `app/api/save-scenario/route.ts` - Save user scenarios

## 🔧 Setup & Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd future-you-simulator
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Variables**
   Create a `.env.local` file with:
   \`\`\`
   GEMINI_API_KEY=your_gemini_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎨 Design Philosophy

The application follows modern design principles with:
- **Gradient Aesthetics**: Blue-to-purple gradients with accent colors
- **Animated Interactions**: Floating elements, hover effects, and smooth transitions
- **Accessibility First**: Proper contrast ratios, semantic HTML, and screen reader support
- **Mobile Responsive**: Optimized layouts for all device sizes

## 🔮 Future Enhancements

- **Database Integration**: Persistent storage for user accounts and scenarios
- **Social Features**: Share and compare results with friends
- **Advanced AI**: More sophisticated lifestyle analysis and recommendations
- **Wearable Integration**: Import real health data from fitness trackers
- **Gamification**: Achievement system and progress rewards
- **Expert Insights**: Integration with health and financial professionals

## 📈 Usage Analytics

The app tracks user engagement through:
- Scenario creation and comparison rates
- AI story generation success rates
- Goal setting and achievement tracking
- Share link creation and usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Health data based on research from WHO and CDC
- Climate data from EPA and environmental research organizations
- Financial calculations based on historical market data
- UI inspiration from modern design systems and Aceternity UI

---

**Built with ❤️ for a better future**
