import pytest
from fastapi.testclient import TestClient
from main import app
from core.security import verify_token
from routers.predict import model
from core.database import SessionLocal
from models.users import User
# AJOUT : On a besoin du modèle History pour le nettoyer
from models.history import PredictionHistory 

@pytest.fixture
def client():
    """
    Crée un client authentifié, gère la création/suppression de l'user ET de son historique.
    """
    TEST_USERNAME = "admin_test_unit"
    db = SessionLocal()

    # --- 1. SETUP (Nettoyage préventif) ---
    # On cherche si l'user existe déjà (reste d'un crash précédent)
    existing_user = db.query(User).filter(User.username == TEST_USERNAME).first()
    if existing_user:
        # On supprime d'abord l'historique lié à cet ancien user
        db.query(PredictionHistory).filter(PredictionHistory.user_id == existing_user.id).delete()
        db.delete(existing_user)
        db.commit()

    # --- 2. CRÉATION USER ---
    test_user = User(username=TEST_USERNAME, hashed_password="fake_hash_for_test")
    db.add(test_user)
    db.commit()
    
    # On rafraichit pour avoir l'ID généré par la BDD
    db.refresh(test_user) 
    
    # --- 3. MOCK AUTH ---
    def mock_auth():
        return {"sub": TEST_USERNAME}

    app.dependency_overrides[verify_token] = mock_auth
    
    # --- 4. EXÉCUTION DU TEST ---
    with TestClient(app) as c:
        yield c
    
    # --- 5. TEARDOWN (Nettoyage propre) ---
    db_clean = SessionLocal()
    user_to_delete = db_clean.query(User).filter(User.username == TEST_USERNAME).first()
    
    if user_to_delete:
        # ÉTAPE CRUCIALE : On supprime l'historique AVANT l'utilisateur
        db_clean.query(PredictionHistory).filter(PredictionHistory.user_id == user_to_delete.id).delete()
        
        # Ensuite on peut supprimer l'utilisateur sans erreur Foreign Key
        db_clean.delete(user_to_delete)
        db_clean.commit()
    
    db_clean.close()
    app.dependency_overrides.clear()

# --- LES TESTS (Inchangés) ---

def test_model_is_loaded():
    assert model is not None, "Le modèle est None"
    assert hasattr(model, "predict_proba"), "Le modèle n'est pas valide"

def test_model_prediction_consistency(client):
    payload = {
        "Age": 30,
        "DailyRate": 500,
        "DistanceFromHome": 5,
        "Education": 3,
        "EnvironmentSatisfaction": 2,
        "HourlyRate": 50,
        "JobInvolvement": 3,
        "JobLevel": 2,
        "JobSatisfaction": 2,
        "MonthlyIncome": 3000,
        "MonthlyRate": 5000,
        "NumCompaniesWorked": 1,
        "PercentSalaryHike": 10,
        "PerformanceRating": 3,
        "RelationshipSatisfaction": 3,
        "StockOptionLevel": 0,
        "TotalWorkingYears": 8,
        "TrainingTimesLastYear": 2,
        "WorkLifeBalance": 2,
        "YearsAtCompany": 5,
        "YearsInCurrentRole": 2,
        "YearsSinceLastPromotion": 0,
        "YearsWithCurrManager": 2,
        "BusinessTravel": "Travel_Rarely",
        "Department": "Research & Development",
        "EducationField": "Medical",
        "Gender": "Male",
        "JobRole": "Laboratory Technician",
        "MaritalStatus": "Single",
        "OverTime": "Yes"
    }

    response = client.post("/ml/predict", json=payload)

    assert response.status_code == 200, f"Erreur API: {response.text}"
    data = response.json()
    assert "churn_probability" in data
    assert isinstance(data["churn_probability"], float)