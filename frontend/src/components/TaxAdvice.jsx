import ReactMarkdown from "react-markdown"

function Spinner() {
  return <span className="spinner" aria-hidden="true" />
}

function TaxAdvice({ advice, isLoading, error }) {
  if (isLoading) {
    return (
      <section className="advice-card advice-card--loading" aria-live="polite">
        <div className="advice-card__loading">
          <Spinner />
          <div>
            <p className="advice-card__loading-title">Analyzing your profile</p>
            <p className="advice-card__loading-text">
              Our AI is preparing personalized tax guidance for you…
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="advice-card advice-card--error" role="alert">
        <div className="advice-card__header">
          <span className="advice-card__icon advice-card__icon--error" aria-hidden="true">
            !
          </span>
          <h2>Unable to generate advice</h2>
        </div>
        <p className="advice-card__error-message">{error}</p>
      </section>
    )
  }

  if (!advice) {
    return null
  }

  return (
    <section className="advice-card advice-card--success">
      <div className="advice-card__header">
        <span className="advice-card__icon advice-card__icon--success" aria-hidden="true">
          ✓
        </span>
        <div>
          <h2>Your Tax Advice</h2>
          <p className="advice-card__meta">Generated based on your financial profile</p>
        </div>
      </div>
      <div className="advice-card__content">
        <ReactMarkdown>{advice}</ReactMarkdown>
      </div>
    </section>
  )
}

export default TaxAdvice
