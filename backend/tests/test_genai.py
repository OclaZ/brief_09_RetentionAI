import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
from core.security import verify_token

client = TestClient(app)

# On contourne l'auth aussi ici
def mock_auth():
    return {"sub": "admin_test"}

app.dependency_overrides[verify_token] = mock_auth

def test_genai_mocked_response():
    """
    Teste la route GenAI SANS appeler l'API de Google.
    On 'Mock' (simule) la réponse pour vérifier que notre code traite bien le retour.
    """
    
    input_data = {
        "churn_probability": 0.85,
        "employee_data": {
            # ... Données minimales requises pour le schema ...
            "Age": 30, "DailyRate": 100, "DistanceFromHome": 10, "Education": 1,
            "EnvironmentSatisfaction": 1, "HourlyRate": 1, "JobInvolvement": 1,
            "JobLevel": 1, "JobSatisfaction": 1, "MonthlyIncome": 1000,
            "MonthlyRate": 1000, "NumCompaniesWorked": 1, "PercentSalaryHike": 1,
            "PerformanceRating": 1, "RelationshipSatisfaction": 1, "StockOptionLevel": 0,
            "TotalWorkingYears": 1, "TrainingTimesLastYear": 1, "WorkLifeBalance": 1,
            "YearsAtCompany": 1, "YearsInCurrentRole": 1, "YearsSinceLastPromotion": 0,
            "YearsWithCurrManager": 0, "BusinessTravel": "Travel_Rarely",
            "Department": "Sales", "EducationField": "Marketing", "Gender": "Male",
            "JobRole": "Sales Representative", "MaritalStatus": "Single", "OverTime": "Yes"
        }
    }

    # --- LA PARTIE TECHNIQUE DU MOCK ---
    # On cible "routers.genai.genai.GenerativeModel" car c'est là qu'il est importé dans ton code
    with patch("routers.genai.genai.GenerativeModel") as MockModel:
        
        # 1. On prépare la fausse réponse
        mock_instance = MockModel.return_value
        # On simule le retour JSON sous forme de texte brut (comme Gemini le ferait)
        mock_instance.generate_content.return_value.text = '["Action Mock 1", "Action Mock 2", "Action Mock 3"]'

        # 2. On lance l'appel API
        response = client.post("/genai/generate-retention-plan", json=input_data)

        # 3. Vérifications
        assert response.status_code == 200
        result = response.json()
        
        # On vérifie qu'on a bien reçu NOTRE fausse liste
        assert result["retention_plan"] == ["Action Mock 1", "Action Mock 2", "Action Mock 3"]
        
        # On vérifie que la vraie API Google n'a JAMAIS été appelée
        # (C'est le mock qui a travaillé)
        mock_instance.generate_content.assert_called_once()