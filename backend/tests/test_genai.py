import pytest

def test_genai_mocked_response(client):
    """
    Teste la génération de plan sans appeler Google (Mock).
    """
    # 1. Setup Utilisateur (Nécessaire car la route est protégée)
    # On crée un utilisateur unique pour éviter les conflits
    username = "ai_tester"
    password = "password123"
    
    # Inscription
    client.post("/auth/register", json={"username": username, "password": password})
    
    # 2. Connexion
    # FIX: Utilisation de 'json' (comme dans test_ml.py qui fonctionne maintenant)
    login_res = client.post(
        "/auth/login",
        json={"username": username, "password": password}
    )
    
    # Vérification que le login a réussi avant de chercher le token
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    
    # 3. Test de la route protégée (Exemple)
    # Vous pouvez décommenter ceci une fois que votre route /genai/generate est prête
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/genai/generate", json={"prompt": "test"}, headers=headers)
    assert response.status_code in [200, 201]