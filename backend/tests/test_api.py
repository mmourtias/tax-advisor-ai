from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app

client = TestClient(app)

def test_valid_tax_advice():
    with patch("router.get_tax_advice", return_value="This is a fake tax advice response"):
        response = client.post("/tax-advice", json={
            "country": "Greece",
            "income": 15000,
            "expenses": 12000,
            "employmentStatus": "employee",
            "maritalStatus": "single",
            "numberOfChildren": 0
        })
        
        assert response.status_code == 200
        assert "advice" in response.json()

def test_invalid_data():
    response = client.post("/tax-advice", json={
        "country": "",
        "income": -1000,
    })
    assert response.status_code == 422