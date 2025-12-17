from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base # Mise à jour syntaxe moderne
import os
from dotenv import load_dotenv

load_dotenv()


SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")


if not SQLALCHEMY_DATABASE_URL:
    # Attention : on utilise les noms exacts de ton fichier .env
    DB_USER = os.getenv("POSTGRES_USER", "postgres")
    DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "112001")
    DB_HOST = os.getenv("HOST", "localhost")
    DB_PORT = os.getenv("POSTGRES_PORT", "5432")
    DB_NAME = os.getenv("POSTGRES_DB", "RetentionAI")
    
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"



engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    try:
        # On tente une connexion simple
        with engine.connect() as connection:
            print(f"✅ Connexion réussie à : {SQLALCHEMY_DATABASE_URL}")
    except Exception as e:
        print(f"❌ Erreur de connexion : {e}")