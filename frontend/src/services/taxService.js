const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function parseErrorMessage(data) {
  if (!data?.detail) {
    return "Failed to get tax advice"
  }

  if (typeof data.detail === "string") {
    return data.detail
  }

  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg).join(", ")
  }

  return "Failed to get tax advice"
}

export async function getTaxAdvice(formData) {
  const response = await fetch(`${API_URL}/tax-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      country: formData.country.trim(),
      income: Number(formData.income),
      expenses: Number(formData.expenses),
      employmentStatus: formData.employmentStatus,
      maritalStatus: formData.maritalStatus,
      numberOfChildren: Number(formData.numberOfChildren),
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(parseErrorMessage(data))
  }

  return data.advice
}
