import { useState } from "react"
import TaxAdvice from "./TaxAdvice"
import { getTaxAdvice } from "../services/taxService"

const initialFormData = {
  country: "",
  income: "",
  expenses: "",
  employmentStatus: "employee",
  maritalStatus: "single",
  numberOfChildren: "0",
}

function validateForm(formData) {
  const errors = {}

  if (!formData.country.trim()) {
    errors.country = "Country is required"
  }

  if (formData.income === "" || Number.isNaN(Number(formData.income))) {
    errors.income = "Income is required"
  } else if (Number(formData.income) < 0) {
    errors.income = "Income must be zero or greater"
  }

  if (formData.expenses === "" || Number.isNaN(Number(formData.expenses))) {
    errors.expenses = "Expenses are required"
  } else if (Number(formData.expenses) < 0) {
    errors.expenses = "Expenses must be zero or greater"
  }

  if (formData.numberOfChildren === "" || Number.isNaN(Number(formData.numberOfChildren))) {
    errors.numberOfChildren = "Number of children is required"
  } else if (Number(formData.numberOfChildren) < 0) {
    errors.numberOfChildren = "Number of children must be zero or greater"
  }

  return errors
}

function TaxForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [fieldErrors, setFieldErrors] = useState({})
  const [advice, setAdvice] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsLoading(true)
    setError("")
    setAdvice("")

    try {
      const result = await getTaxAdvice(formData)
      setAdvice(result)
    } catch (submitError) {
      setError(submitError.message || "Failed to get tax advice")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="tax-form">
      <section className="form-card">
        <div className="form-card__header">
          <h2>Your Financial Profile</h2>
          <p>Fill in your details to receive personalized tax guidance.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field form-field--full">
              <label htmlFor="country">Country of residence</label>
              <input
                id="country"
                type="text"
                placeholder="e.g. Greece, Germany, United Kingdom"
                value={formData.country}
                onChange={(event) => updateField("country", event.target.value)}
                aria-invalid={Boolean(fieldErrors.country)}
              />
              {fieldErrors.country && <span className="field-error">{fieldErrors.country}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="income">Annual income</label>
              <input
                id="income"
                type="number"
                placeholder="0"
                min={0}
                step="any"
                value={formData.income}
                onChange={(event) =>
                  updateField(
                    "income",
                    event.target.value === "" ? "" : parseFloat(event.target.value),
                  )
                }
                aria-invalid={Boolean(fieldErrors.income)}
              />
              <span className="field-hint">In local currency</span>
              {fieldErrors.income && <span className="field-error">{fieldErrors.income}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="expenses">Annual expenses</label>
              <input
                id="expenses"
                type="number"
                placeholder="0"
                min={0}
                step="any"
                value={formData.expenses}
                onChange={(event) =>
                  updateField(
                    "expenses",
                    event.target.value === "" ? "" : parseFloat(event.target.value),
                  )
                }
                aria-invalid={Boolean(fieldErrors.expenses)}
              />
              <span className="field-hint">Deductible &amp; business expenses</span>
              {fieldErrors.expenses && <span className="field-error">{fieldErrors.expenses}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="employmentStatus">Employment status</label>
              <select
                id="employmentStatus"
                value={formData.employmentStatus}
                onChange={(event) => updateField("employmentStatus", event.target.value)}
              >
                <option value="employee">Employee</option>
                <option value="self-employed">Self-employed</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="maritalStatus">Marital status</label>
              <select
                id="maritalStatus"
                value={formData.maritalStatus}
                onChange={(event) => updateField("maritalStatus", event.target.value)}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="numberOfChildren">Number of children</label>
              <input
                id="numberOfChildren"
                type="number"
                placeholder="0"
                min={0}
                step={1}
                value={formData.numberOfChildren}
                onChange={(event) =>
                  updateField(
                    "numberOfChildren",
                    event.target.value === "" ? "" : parseInt(event.target.value, 10),
                  )
                }
                aria-invalid={Boolean(fieldErrors.numberOfChildren)}
              />
              {fieldErrors.numberOfChildren && (
                <span className="field-error">{fieldErrors.numberOfChildren}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner spinner--light" aria-hidden="true" />
                Generating advice…
              </>
            ) : (
              "Get Tax Advice"
            )}
          </button>
        </form>
      </section>

      <TaxAdvice advice={advice} isLoading={isLoading} error={error} />
    </div>
  )
}

export default TaxForm
