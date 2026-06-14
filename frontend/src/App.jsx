import TaxForm from "./components/TaxForm"
import "./App.css"

const FEATURES = [
  "Personalized guidance",
  "Country-specific insights",
  "Instant AI analysis",
]

function App() {
  return (
    <div className="page">
      <main className="app">
        <header className="hero">
          <div className="hero__badge">AI-Powered Tax Assistant</div>
          <h1 className="hero__title">Tax Advisor AI</h1>
          <p className="hero__subtitle">
            Enter your financial profile and receive clear, structured tax guidance
            tailored to your situation — in seconds.
          </p>
          <ul className="hero__features">
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </header>

        <TaxForm />

        <footer className="footer">
          <p>
            <strong>Disclaimer:</strong> This application provides general tax information
            only. It does not constitute professional tax, legal, or financial advice.
            Always consult a certified tax professional before making decisions.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
