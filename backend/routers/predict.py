from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import joblib
import pandas as pd
import json
import os
import sys

# --- IMPORT CRUCIAL POUR LE MODÈLE SMOTE ---
# Même si on ne l'utilise pas directement dans le code, 
# joblib en a besoin pour charger le pipeline.
import imblearn 
# -------------------------------------------

# Nos modules
from core.database import get_db
from core.security import verify_token
from models.users import User
from models.history import PredictionHistory
from schemas.schemas import EmployeeData, PredictionResponse

router = APIRouter(tags=["Machine Learning"])

# ==============================================================================
# 1. Chargement Robuste du Modèle
# ==============================================================================

# On calcule le chemin absolu vers backend/model.pkl
# __file__ = routers/predict.py -> parent = routers -> grand-parent = backend
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
model_path = os.path.join(backend_dir, "model.pkl")

print(f"📂 Recherche du modèle ici : {model_path}")

try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"✅ VRAI Modèle ML chargé avec succès ! (Type: {type(model).__name__})")
    else:
        print("❌ Fichier model.pkl introuvable au chemin indiqué.")
        model = None
except ImportError as e:
    print(f"❌ ERREUR CRITIQUE : Il manque une librairie pour lire le modèle.")
    print(f"Détail : {e}")
    print("💡 Solution : pip install imbalanced-learn scikit-learn==1.3.2")
    model = None
except Exception as e:
    print(f"❌ Erreur inconnue au chargement : {e}")
    model = None


# ==============================================================================
# 2. La Route de Prédiction
# ==============================================================================

@router.post("/predict", response_model=PredictionResponse)
def predict_churn(
    data: EmployeeData, 
    payload: dict = Depends(verify_token), # Sécurité JWT
    db: Session = Depends(get_db)
):
    # Vérification initiale
    if model is None:
        raise HTTPException(
            status_code=500, 
            detail="Le modèle ML n'est pas chargé sur le serveur. Vérifiez les logs."
        )

    # Récupération de l'utilisateur
    username = payload.get("sub")
    current_user = db.query(User).filter(User.username == username).first()
    if not current_user:
        raise HTTPException(status_code=401, detail="Utilisateur introuvable")

    try:
        # 3. Préparation des données (JSON -> DataFrame)
        # On utilise model_dump() pour Pydantic v2 (ou dict() pour v1)
        input_data = data.model_dump()
        input_df = pd.DataFrame([input_data]) 

        # 4. Prédiction
        # Le pipeline va gérer tout seul le Scaling et le OneHotEncoder !
        # .predict_proba renvoie [[Prob_No, Prob_Yes]] -> on prend [0][1]
        probability = model.predict_proba(input_df)[0][1]

        # 5. Sauvegarde en Base de Données
        history_entry = PredictionHistory(
            user_id=current_user.id,
            probability=probability,
            # On stocke les données d'entrée en JSON pour traçabilité
            input_data=json.dumps(input_data, default=str) 
        )
        db.add(history_entry)
        db.commit()

        # 6. Réponse
        return {
            "churn_probability": round(probability, 2),
            "alert": probability > 0.50
        }

    except Exception as e:
        # En cas d'erreur (ex: colonne manquante, format incorrect)
        print(f"Erreur prédiction: {e}")
        raise HTTPException(status_code=400, detail=f"Erreur lors de la prédiction : {str(e)}")