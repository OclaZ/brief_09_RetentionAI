import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Depends
from core.security import verify_token
from schemas.schemas import RetentionInput, RetentionResponse

router = APIRouter(tags=["GenAI"])

# Configuration de Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("⚠️ ATTENTION : Pas de clé GEMINI_API_KEY trouvée dans .env")

genai.configure(api_key=api_key)

@router.post("/generate-retention-plan", response_model=RetentionResponse)
def generate_retention_plan(
    input_data: RetentionInput,
    payload: dict = Depends(verify_token) # Route sécurisée
):
    # 1. Logique Métier : Si le risque est faible, pas besoin d'IA
    if input_data.churn_probability < 0.50:
        return {
            "retention_plan": [
                "Risque faible (inférieur à 50%).",
                "Aucune action spécifique requise pour le moment.",
                "Maintenir les entretiens annuels habituels."
            ]
        }

    # 2. Préparation des données pour le Prompt
    emp = input_data.employee_data
    
    # 3. Construction du Prompt (Prompt Engineering)
    # On injecte les variables Python dans le texte
    prompt = f"""
    Agis comme un expert RH senior spécialisé dans la rétention des talents.
    
    CONTEXTE :
    Un employé a été identifié par notre modèle prédictif avec un risque de départ (Churn Probability) de {input_data.churn_probability:.0%}.
    
    PROFIL DE L'EMPLOYÉ :
    - Age : {emp.Age} ans
    - Rôle : {emp.JobRole} ({emp.Department})
    - Ancienneté : {emp.YearsAtCompany} ans
    - Satisfaction au travail : {emp.JobSatisfaction}/4
    - Satisfaction Environnement : {emp.EnvironmentSatisfaction}/4
    - Heures Supplémentaires (OverTime) : {emp.OverTime}
    - Salaire Mensuel : {emp.MonthlyIncome} $
    - Équilibre Vie Pro/Perso : {emp.WorkLifeBalance}/4
    - Distance Domicile : {emp.DistanceFromHome} km
    
    TACHE :
    Propose 3 actions concrètes, personnalisées et immédiatement applicables pour retenir cet employé.
    Concentre-toi sur les points faibles de son profil (ex: satisfaction basse, salaire, trajet...).
    
    FORMAT DE RÉPONSE ATTENDU :
    Réponds UNIQUEMENT par une liste JSON brute de 3 phrases courtes. 
    Exemple : ["Action 1...", "Action 2...", "Action 3..."]
    Ne mets pas de texte avant ou après le JSON.
    """

    try:
        # 4. Appel à Gemini
        model = genai.GenerativeModel('gemini-pro') # ou gemini-1.5-flash
        response = model.generate_content(prompt)
        
        # 5. Nettoyage de la réponse (Parsing)
        # Gemini peut parfois être bavard, on nettoie pour récupérer juste la liste
        text_response = response.text.strip()
        
        # On enlève les balises Markdown ```json et ``` si présentes
        if text_response.startswith("```json"):
            text_response = text_response.replace("```json", "").replace("```", "")
        
        import json
        actions_list = json.loads(text_response)
        
        return {"retention_plan": actions_list}

    except Exception as e:
        print(f"Erreur GenAI : {e}")
        # Fallback en cas de panne de l'IA (Mock)
        return {
            "retention_plan": [
                "Organiser un entretien de carrière individuel.",
                "Proposer une révision salariale ou des primes.",
                "Aménager le temps de travail (Télétravail/Horaires)."
            ]
        }