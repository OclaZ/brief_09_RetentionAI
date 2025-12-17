from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from core.database import Base

class PredictionHistory(Base):
    __tablename__ = "predictions_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    probability = Column(Float)
    input_data = Column(String)