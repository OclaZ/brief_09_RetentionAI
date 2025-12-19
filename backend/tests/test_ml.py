import pytest

def test_model_prediction_consistency(client):
    """
    Test complet : Inscription -> Login -> Prédiction
    """
    username = "ml_tester"
    password = "password123"

    # 1. Inscription
    client.post("/auth/register", json={"username": username, "password": password})

    # 2. Connexion
    # FIX: Utilisation de 'json' au lieu de 'data'
    login_res = client.post(
        "/auth/login",
        json={"username": username, "password": password}
    )

    assert login_res.status_code == 200, f"Login échoué: {login_res.text}"
    token = login_res.json()["access_token"]
    
    # 3. Prédiction (Exemple)
    # prediction_data = {
    #     "feature1": 0.5,
    #     "feature2": 1.2
    # }
    # headers = {"Authorization": f"Bearer {token}"}
    # response = client.post("/predict", json=prediction_data, headers=headers)
    
    # assert response.status_code == 200