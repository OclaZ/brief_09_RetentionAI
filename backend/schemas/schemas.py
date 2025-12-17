from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

# --- Auth Schemas ---
class UserCreate(BaseModel):
    username: str
    password: str

# Pour le Register (Sortie - on cache le mot de passe)
class UserOut(BaseModel):
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Pour le Login (Entrée)
class LoginRequest(BaseModel):
    username: str
    password: str

# Pour le Login (Sortie)
class LoginResponse(BaseModel):
    access_token: str
    token_type: str

class EmployeeData(BaseModel):

    Age: int
    DailyRate: int
    DistanceFromHome: int
    Education: int
    EnvironmentSatisfaction: int
    HourlyRate: int
    JobInvolvement: int
    JobLevel: int
    JobSatisfaction: int
    MonthlyIncome: int
    MonthlyRate: int
    NumCompaniesWorked: int
    PercentSalaryHike: int
    PerformanceRating: int
    RelationshipSatisfaction: int
    StockOptionLevel: int
    TotalWorkingYears: int
    TrainingTimesLastYear: int
    WorkLifeBalance: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int
    BusinessTravel: str
    Department: str
    EducationField: str
    Gender: str
    JobRole: str
    MaritalStatus: str
    OverTime: str

class PredictionResponse(BaseModel):
    churn_probability: float
    alert: bool

# --- GenAI Schema ---
class RetentionRequest(BaseModel):
    churn_probability: float
    employee_context: dict # On passe les infos de l'employé (Age, Role...)

class RetentionPlanResponse(BaseModel):
    retention_plan: List[str]

class RetentionInput(BaseModel):
    churn_probability: float
    employee_data: EmployeeData # On réutilise ton schema existant !

# Ce que l'IA nous répond
class RetentionResponse(BaseModel):
    retention_plan: list[str] # Une liste de 3 actions
