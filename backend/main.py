from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT IMPORTANT
from core.database import engine, Base
from routers import auth, predict, genai

# Création des tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RetentionAI API")

origins = [
    "http://localhost:3000",      # Ton frontend Next.js
    "http://127.0.0.1:3000",      # Variante IP
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Qui a le droit d'entrer ?
    allow_credentials=True,       # Autoriser les cookies/auth headers
    allow_methods=["*"],          # Autoriser toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],          # Autoriser tous les headers
)

app.include_router(auth.router, prefix="/auth")
app.include_router(predict.router, prefix="/ml")
app.include_router(genai.router, prefix="/genai")

@app.get("/")
def root():
    return {"message": "API RetentionAI opérationnelle 🚀"}