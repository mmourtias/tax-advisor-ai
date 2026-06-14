const API_URL = "http://127.0.0.1:8000"

export async function getTaxAdvice(formData) {
  const response = await fetch(`${API_URL}/tax-advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  
  const data = await response.json()
  return data.advice
}