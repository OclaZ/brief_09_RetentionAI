import pandas as pd
import joblib

# Les imports pour le Machine Learning
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from imblearn.over_sampling import SMOTENC
from imblearn.pipeline import Pipeline


print("Chargement du fichier csv...")
df = pd.read_csv('data.csv')

# On enlève les colonnes qui ne servent à rien
colonnes_inutiles = ['EmployeeCount', 'Over18', 'StandardHours', 'EmployeeNumber']
df = df.drop(colonnes_inutiles, axis=1)

print("Préparation des colonnes...")

# X = les données, y = la réponse (Attrition)
X = df.drop('Attrition', axis=1)
y = df['Attrition']

# On transforme Oui/Non en 1/0
encoder = LabelEncoder()
y = encoder.fit_transform(y)

# On liste les colonnes textes et chiffres pour les traiter différemment
colonnes_textes = X.select_dtypes(include=['object']).columns
colonnes_chiffres = X.select_dtypes(include=['int64', 'float64']).columns

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), colonnes_chiffres),
        ('cat', OneHotEncoder(handle_unknown='ignore'), colonnes_textes)
    ])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("\n--- Comparaison des modèles avec SMOTE ---")


modeles = [
    ("Régression Logistique", LogisticRegression(max_iter=1000, random_state=42)),
    ("Random Forest", RandomForestClassifier(n_estimators=100, random_state=42))
]

meilleur_score = 0
meilleur_pipeline = None
meilleur_model = ""

for nom, algo in modeles:
    print(f"Test de : {nom}...")
    
    pipeline = Pipeline(steps=[
        ('nettoyage', preprocessor),
        ('equilibrage', SMOTENC(random_state=42 , categorical_features=[X.columns.get_loc(col) for col in colonnes_textes])),
        ('modele', algo)
    ])
    
    # On entraine
    pipeline.fit(X_train, y_train)
    
    y_prob = pipeline.predict_proba(X_test)[:, 1]
    score_auc = roc_auc_score(y_test, y_prob)
    
    print(f" -> Score AUC : {score_auc:.4f}")
    
    if score_auc > meilleur_score:
        meilleur_score = score_auc
        meilleur_pipeline = pipeline
        meilleur_model = nom

print(f"\nLe meilleur modèle est : {meilleur_model} avec un score de {meilleur_score:.4f}")


print(f"\n--- Optimisation de {meilleur_model} ---")


if meilleur_model == "Random Forest":
    parametres = {
        'modele__max_depth': [5, 10, None],   
        'modele__min_samples_leaf': [2, 4]    
    }
else:
    parametres = {'modele__C': [0.1, 1, 10]}

grid = GridSearchCV(meilleur_pipeline, parametres, cv=3, scoring='recall')
grid.fit(X_train, y_train)

modele_final = grid.best_estimator_
print("Meilleurs paramètres trouvés :", grid.best_params_)

y_pred = modele_final.predict(X_test)
print(classification_report(y_test, y_pred))

joblib.dump(modele_final, 'model.pkl')
print("Fichier 'model.pkl' créé avec succès !")