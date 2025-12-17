"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Assure-toi d'avoir créé ce fichier
import { Button } from "@/components/ui/Button";
import { Activity, AlertTriangle, CheckCircle, User, Briefcase, Zap, LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [plan, setPlan] = useState<string[]>([]);
  
  // TOUS les champs nécessaires pour le modèle ML
  const [employee, setEmployee] = useState({
    Age: 32,
    DailyRate: 1000,
    DistanceFromHome: 5,
    Education: 3,
    EnvironmentSatisfaction: 2,
    HourlyRate: 90,
    JobInvolvement: 3,
    JobLevel: 2,
    JobSatisfaction: 1,
    MonthlyIncome: 4500,
    MonthlyRate: 15000,
    NumCompaniesWorked: 4,
    PercentSalaryHike: 12,
    PerformanceRating: 3,
    RelationshipSatisfaction: 4,
    StockOptionLevel: 0,
    TotalWorkingYears: 10,
    TrainingTimesLastYear: 2,
    WorkLifeBalance: 2,
    YearsAtCompany: 5,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 0,
    YearsWithCurrManager: 3,
    BusinessTravel: "Travel_Rarely",
    Department: "Research & Development",
    EducationField: "Life Sciences",
    Gender: "Male",
    JobRole: "Laboratory Technician",
    MaritalStatus: "Single",
    OverTime: "Yes"
  });

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
        router.push("/login");
    } else {
        setToken(t);
    }
  }, []);

  // Gestion générique des changements d'inputs
  const handleChange = (e: any, field: string, type: "int" | "str" = "str") => {
    setEmployee({
        ...employee,
        [field]: type === "int" ? parseInt(e.target.value) || 0 : e.target.value
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const resML = await axios.post("http://127.0.0.1:8000/ml/predict", employee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrediction(resML.data);

      if (resML.data.churn_probability > 0.5) {
        const resAI = await axios.post("http://127.0.0.1:8000/genai/generate-retention-plan", {
          churn_probability: resML.data.churn_probability,
          employee_data: employee
        }, { headers: { Authorization: `Bearer ${token}` } });
        setPlan(resAI.data.retention_plan);
      } else {
        setPlan([]);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la communication avec l'API. Vérifiez que le Backend tourne.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8 text-white font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-green to-brand-purple">RetentionAI Dashboard</h1>
            <p className="text-gray-400">Analyse prédictive de démission & IA Générative</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="bg-card px-4 py-2 rounded-full border border-gray-700 flex items-center gap-2">
                <User size={18} className="text-brand-green" />
                <span className="text-sm">Manager RH Connecté</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition">
                <LogOut size={20} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : LE GRAND FORMULAIRE */}
        <div className="xl:col-span-2 space-y-6">
            <Card variant="dark" className="border-t-4 border-t-brand-purple">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gray-800 rounded-xl"><Briefcase size={20} className="text-brand-purple"/></div>
                    <h2 className="text-xl font-bold">Profil de l'Employé</h2>
                </div>
                
                <div className="space-y-8">
                    {/* SECTION 1 : INFOS CLÉS */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Informations Générales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Age" type="number" value={employee.Age} onChange={(e:any) => handleChange(e, "Age", "int")} />
                            <Select label="Genre" options={["Male", "Female"]} value={employee.Gender} onChange={(e:any) => handleChange(e, "Gender")} />
                            <Select label="Statut Marital" options={["Single", "Married", "Divorced"]} value={employee.MaritalStatus} onChange={(e:any) => handleChange(e, "MaritalStatus")} />
                            <Input label="Distance Domicile (km)" type="number" value={employee.DistanceFromHome} onChange={(e:any) => handleChange(e, "DistanceFromHome", "int")} />
                            <Select label="Éducation (1-5)" options={["1", "2", "3", "4", "5"]} value={employee.Education} onChange={(e:any) => handleChange(e, "Education", "int")} />
                            <Select label="Domaine Études" options={["Life Sciences", "Medical", "Marketing", "Technical Degree", "Human Resources", "Other"]} value={employee.EducationField} onChange={(e:any) => handleChange(e, "EducationField")} />
                        </div>
                    </div>

                    {/* SECTION 2 : LE JOB */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Poste & Entreprise</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select label="Département" options={["Sales", "Research & Development", "Human Resources"]} value={employee.Department} onChange={(e:any) => handleChange(e, "Department")} />
                            <Select label="Rôle" options={["Sales Executive", "Research Scientist", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources"]} value={employee.JobRole} onChange={(e:any) => handleChange(e, "JobRole")} />
                            <Select label="Voyages Pro" options={["Non-Travel", "Travel_Rarely", "Travel_Frequently"]} value={employee.BusinessTravel} onChange={(e:any) => handleChange(e, "BusinessTravel")} />
                            
                            <Input label="Années en Entreprise" type="number" value={employee.YearsAtCompany} onChange={(e:any) => handleChange(e, "YearsAtCompany", "int")} />
                            <Input label="Années Rôle Actuel" type="number" value={employee.YearsInCurrentRole} onChange={(e:any) => handleChange(e, "YearsInCurrentRole", "int")} />
                            <Input label="Années avec Manager" type="number" value={employee.YearsWithCurrManager} onChange={(e:any) => handleChange(e, "YearsWithCurrManager", "int")} />
                            <Input label="Total Années Exp." type="number" value={employee.TotalWorkingYears} onChange={(e:any) => handleChange(e, "TotalWorkingYears", "int")} />
                            <Input label="Nb Entreprises Préc." type="number" value={employee.NumCompaniesWorked} onChange={(e:any) => handleChange(e, "NumCompaniesWorked", "int")} />
                        </div>
                    </div>

                    {/* SECTION 3 : ARGENT & PERFORMANCE */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Rémunération & Facteurs Risque</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Revenu Mensuel ($)" type="number" value={employee.MonthlyIncome} onChange={(e:any) => handleChange(e, "MonthlyIncome", "int")} />
                            <Input label="Taux Journalier" type="number" value={employee.DailyRate} onChange={(e:any) => handleChange(e, "DailyRate", "int")} />
                            <Input label="% Augmentation" type="number" value={employee.PercentSalaryHike} onChange={(e:any) => handleChange(e, "PercentSalaryHike", "int")} />
                            
                            <div className="col-span-1 md:col-span-2 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 block">Heures Supplémentaires (Critique)</label>
                                <div className="flex gap-4">
                                    <button onClick={()=>setEmployee({...employee, OverTime: "Yes"})} className={`flex-1 py-3 rounded-xl border font-bold transition-all ${employee.OverTime==="Yes" ? "bg-red-500/20 text-red-400 border-red-500" : "bg-transparent border-gray-700 hover:bg-gray-700"}`}>OUI (Risque)</button>
                                    <button onClick={()=>setEmployee({...employee, OverTime: "No"})} className={`flex-1 py-3 rounded-xl border font-bold transition-all ${employee.OverTime==="No" ? "bg-brand-green/20 text-brand-green border-brand-green" : "bg-transparent border-gray-700 hover:bg-gray-700"}`}>NON</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4 : SATISFACTION (1-4) */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Niveaux de Satisfaction (1-4)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input label="Job Satisfaction" type="number" min="1" max="4" value={employee.JobSatisfaction} onChange={(e:any) => handleChange(e, "JobSatisfaction", "int")} />
                            <Input label="Environnement" type="number" min="1" max="4" value={employee.EnvironmentSatisfaction} onChange={(e:any) => handleChange(e, "EnvironmentSatisfaction", "int")} />
                            <Input label="Relations" type="number" min="1" max="4" value={employee.RelationshipSatisfaction} onChange={(e:any) => handleChange(e, "RelationshipSatisfaction", "int")} />
                            <Input label="Vie Pro/Perso" type="number" min="1" max="4" value={employee.WorkLifeBalance} onChange={(e:any) => handleChange(e, "WorkLifeBalance", "int")} />
                            <Input label="Implication Job" type="number" min="1" max="4" value={employee.JobInvolvement} onChange={(e:any) => handleChange(e, "JobInvolvement", "int")} />
                            <Input label="Niveau Job" type="number" min="1" max="5" value={employee.JobLevel} onChange={(e:any) => handleChange(e, "JobLevel", "int")} />
                            <Input label="Performance" type="number" min="1" max="4" value={employee.PerformanceRating} onChange={(e:any) => handleChange(e, "PerformanceRating", "int")} />
                            <Input label="Stock Options (0-3)" type="number" min="0" max="3" value={employee.StockOptionLevel} onChange={(e:any) => handleChange(e, "StockOptionLevel", "int")} />
                            <Input label="Formations An dernier" type="number" min="0" max="6" value={employee.TrainingTimesLastYear} onChange={(e:any) => handleChange(e, "TrainingTimesLastYear", "int")} />
                            <Input label="Années Sans Promo" type="number" value={employee.YearsSinceLastPromotion} onChange={(e:any) => handleChange(e, "YearsSinceLastPromotion", "int")} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <Button onClick={handlePredict} isLoading={loading}>
                        <Zap size={20} /> ANALYSER CE PROFIL
                    </Button>
                </div>
            </Card>
        </div>

        {/* COLONNE DROITE : RÉSULTATS */}
        <div className="space-y-6">
            
            {/* CARTE DE PREDICTION */}
            {prediction ? (
                <Card variant={prediction.churn_probability > 0.5 ? "purple" : "green"} className="relative overflow-hidden border-0">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold opacity-80 text-gray-900">Probabilité de Départ</h3>
                            {prediction.churn_probability > 0.5 ? <AlertTriangle className="text-gray-900 animate-pulse"/> : <CheckCircle className="text-gray-900"/>}
                        </div>
                        <div className="text-6xl font-black text-gray-900 mb-2 tracking-tighter">
                            {(prediction.churn_probability * 100).toFixed(0)}<span className="text-4xl">%</span>
                        </div>
                        <div className="inline-block px-3 py-1 bg-white/20 rounded-lg text-gray-900 font-bold backdrop-blur-sm">
                            {prediction.churn_probability > 0.5 ? "🚨 RISQUE ÉLEVÉ" : "✅ PROFIL STABLE"}
                        </div>
                    </div>
                    {/* Décoration background */}
                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/30 rounded-full blur-3xl"></div>
                </Card>
            ) : (
                <Card variant="dark" className="border-dashed border-2 border-gray-700 flex flex-col items-center justify-center h-64 text-center p-8 opacity-50">
                    <Activity size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-400 font-medium">Remplissez le formulaire et lancez l'analyse pour voir le résultat.</p>
                </Card>
            )}

            {/* CARTE PLAN IA */}
            {plan.length > 0 && (
                <Card variant="light" className="h-auto border-l-8 border-l-brand-purple">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="p-2 bg-brand-purple text-white rounded-lg"><Zap size={20}/></div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Plan de Rétention IA</h3>
                            <p className="text-xs text-gray-500">Généré par Gemini Pro</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {plan.map((action, i) => (
                            <div key={i} className="flex gap-4 items-start group">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                                        {i+1}
                                    </div>
                                    {i !== plan.length - 1 && <div className="w-0.5 h-full bg-gray-200 min-h-[40px]"></div>}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <p className="text-gray-800 font-medium leading-relaxed">{action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* PETIT RÉSUMÉ RAPIDE */}
            <div className="grid grid-cols-2 gap-4">
                 <div className="bg-card p-4 rounded-3xl border border-gray-800 text-center">
                    <p className="text-gray-500 text-xs uppercase mb-1">Dernière Mise à jour</p>
                    <p className="font-bold text-white">Aujourd'hui</p>
                 </div>
                 <div className="bg-card p-4 rounded-3xl border border-gray-800 text-center">
                    <p className="text-gray-500 text-xs uppercase mb-1">Modèle ML</p>
                    <p className="font-bold text-brand-green">Actif v1.0</p>
                 </div>
            </div>

        </div>
      </div>
    </div>
  );
}