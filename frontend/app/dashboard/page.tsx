"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  LogOut, 
  Zap, 
  Briefcase, 
  User, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";

// On importe tes composants UI (assure-toi qu'ils existent dans components/ui/)
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [plan, setPlan] = useState<string[]>([]);
  
  // --- ÉTAT DU FORMULAIRE (30 champs requis par le Backend) ---
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

  // --- VÉRIFICATION AUTH ---
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
        router.push("/login");
    } else {
        setToken(t);
    }
  }, [router]);

  // --- GESTION DES INPUTS ---
  const handleChange = (e: any, field: string, type: "int" | "str" = "str") => {
    setEmployee({
        ...employee,
        [field]: type === "int" ? parseInt(e.target.value) || 0 : e.target.value
    });
  };

  // --- LOGIQUE PRINCIPALE (ML + IA) ---
  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    setPlan([]);
    
    try {
      // 1. Appel au modèle de prédiction
      const resML = await axios.post("http://127.0.0.1:8000/ml/predict", employee, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrediction(resML.data);

      // 2. Si risque élevé (> 50%), on appelle Gemini
      if (resML.data.churn_probability > 0.5) {
        const resAI = await axios.post("http://127.0.0.1:8000/genai/generate-retention-plan", {
          churn_probability: resML.data.churn_probability,
          employee_data: employee
        }, { headers: { Authorization: `Bearer ${token}` } });
        setPlan(resAI.data.retention_plan);
      }

    } catch (e) {
      console.error(e);
      alert("Erreur de connexion avec l'API. Vérifiez que le backend tourne sur le port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-gray-100 selection:bg-brand-purple selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-green to-brand-purple rounded-xl flex items-center justify-center text-black font-bold shadow-lg shadow-brand-green/20">
                AI
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white">RetentionAI</h1>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-gray-400">Système opérationnel</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end border-r border-gray-700 pr-4 mr-2">
                <span className="text-sm font-medium text-white">Admin RH</span>
                <span className="text-xs text-gray-500">Session Sécurisée</span>
            </div>
            <button 
                onClick={handleLogout} 
                className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 transition-all"
                title="Déconnexion"
            >
                <LogOut size={18} className="text-gray-400 group-hover:text-red-400" />
            </button>
        </div>
      </nav>

      {/* --- GRILLE PRINCIPALE --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* === COLONNE GAUCHE : FORMULAIRE (8/12) === */}
        <div className="xl:col-span-8 space-y-6">
            
            {/* Header Formulaire */}
            <div className="backdrop-blur-xl bg-card/60 border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl -z-10"></div>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/5 shadow-inner">
                        <User size={24} className="text-brand-light"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Profil Collaborateur</h2>
                        <p className="text-gray-400 text-sm">Entrez les données RH pour calculer le risque de départ.</p>
                    </div>
                </div>
                
                {/* Inputs Groupés */}
                <div className="space-y-10">
                    
                    {/* SECTION 1 : Identité */}
                    <section>
                        <h3 className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-widest mb-6">
                            <Activity size={14}/> Données Personnelles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Input label="Age" type="number" value={employee.Age} onChange={(e:any) => handleChange(e, "Age", "int")} />
                            <Select label="Genre" options={["Male", "Female"]} value={employee.Gender} onChange={(e:any) => handleChange(e, "Gender")} />
                            <Select label="Statut Marital" options={["Single", "Married", "Divorced"]} value={employee.MaritalStatus} onChange={(e:any) => handleChange(e, "MaritalStatus")} />
                            <Input label="Distance (km)" type="number" value={employee.DistanceFromHome} onChange={(e:any) => handleChange(e, "DistanceFromHome", "int")} />
                            <Select label="Niveau Études" options={["1", "2", "3", "4", "5"]} value={employee.Education} onChange={(e:any) => handleChange(e, "Education", "int")} />
                            <Select label="Domaine" options={["Life Sciences", "Medical", "Marketing", "Technical Degree", "Other"]} value={employee.EducationField} onChange={(e:any) => handleChange(e, "EducationField")} />
                        </div>
                    </section>

                    {/* SECTION 2 : Carrière */}
                    <section>
                        <h3 className="flex items-center gap-2 text-xs font-bold text-brand-purple uppercase tracking-widest mb-6">
                            <Briefcase size={14}/> Poste & Carrière
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Select label="Département" options={["Sales", "Research & Development", "Human Resources"]} value={employee.Department} onChange={(e:any) => handleChange(e, "Department")} />
                            <Select label="Rôle Actuel" options={["Sales Executive", "Research Scientist", "Laboratory Technician", "Manufacturing Director", "Healthcare Representative", "Manager", "Sales Representative", "Research Director", "Human Resources"]} value={employee.JobRole} onChange={(e:any) => handleChange(e, "JobRole")} />
                            <Select label="Voyages" options={["Non-Travel", "Travel_Rarely", "Travel_Frequently"]} value={employee.BusinessTravel} onChange={(e:any) => handleChange(e, "BusinessTravel")} />
                            
                            <Input label="Années Ancienneté" type="number" value={employee.YearsAtCompany} onChange={(e:any) => handleChange(e, "YearsAtCompany", "int")} />
                            <Input label="Années Rôle Actuel" type="number" value={employee.YearsInCurrentRole} onChange={(e:any) => handleChange(e, "YearsInCurrentRole", "int")} />
                            <Input label="Années Manager" type="number" value={employee.YearsWithCurrManager} onChange={(e:any) => handleChange(e, "YearsWithCurrManager", "int")} />
                        </div>
                    </section>
                    
                    {/* SECTION 3 : Salaire & Risques */}
                    <section>
                        <h3 className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">
                            <TrendingUp size={14}/> Rémunération & Facteurs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Input label="Salaire Mensuel ($)" type="number" value={employee.MonthlyIncome} onChange={(e:any) => handleChange(e, "MonthlyIncome", "int")} />
                            <Input label="% Augmentation" type="number" value={employee.PercentSalaryHike} onChange={(e:any) => handleChange(e, "PercentSalaryHike", "int")} />
                            <Input label="Stock Options (0-3)" type="number" min="0" max="3" value={employee.StockOptionLevel} onChange={(e:any) => handleChange(e, "StockOptionLevel", "int")} />
                            
                            {/* Switch Heures Sup Custom */}
                            <div className="col-span-1 md:col-span-2 bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">Heures Supplémentaires</label>
                                    <p className="text-xs text-gray-500">Facteur critique de burnout</p>
                                </div>
                                <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
                                    <button 
                                        onClick={()=>setEmployee({...employee, OverTime: "No"})} 
                                        className={`px-4 py-2 text-sm rounded-md transition-all font-bold ${employee.OverTime==="No" ? "bg-brand-green text-black shadow-lg shadow-brand-green/20" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        Non
                                    </button>
                                    <button 
                                        onClick={()=>setEmployee({...employee, OverTime: "Yes"})} 
                                        className={`px-4 py-2 text-sm rounded-md transition-all font-bold ${employee.OverTime==="Yes" ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "text-gray-500 hover:text-gray-300"}`}
                                    >
                                        Oui
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4 : Satisfaction */}
                    <section>
                        <h3 className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-6">
                            <Zap size={14}/> Satisfaction (1-4)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input label="Job Satisfaction" type="number" min="1" max="4" value={employee.JobSatisfaction} onChange={(e:any) => handleChange(e, "JobSatisfaction", "int")} />
                            <Input label="Environnement" type="number" min="1" max="4" value={employee.EnvironmentSatisfaction} onChange={(e:any) => handleChange(e, "EnvironmentSatisfaction", "int")} />
                            <Input label="Relations" type="number" min="1" max="4" value={employee.RelationshipSatisfaction} onChange={(e:any) => handleChange(e, "RelationshipSatisfaction", "int")} />
                            <Input label="Vie Pro/Perso" type="number" min="1" max="4" value={employee.WorkLifeBalance} onChange={(e:any) => handleChange(e, "WorkLifeBalance", "int")} />
                        </div>
                    </section>

                </div>

                {/* Footer Formulaire */}
                <div className="mt-10 pt-6 border-t border-white/5 flex justify-end sticky bottom-0 bg-transparent">
                    <div className="w-full md:w-auto min-w-[200px]">
                        <Button onClick={handlePredict} isLoading={loading}>
                            {loading ? "Analyse en cours..." : (
                                <>
                                   <Zap size={18} className="fill-current" /> Lancer l'IA
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        {/* === COLONNE DROITE : RÉSULTATS (4/12) === */}
        <div className="xl:col-span-4 space-y-6">
            
            {/* 1. CARTE DE SCORE (Prediction) */}
            <div className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-700 group ${
                !prediction ? "bg-card border border-white/5 border-dashed" : 
                prediction.churn_probability > 0.5 
                    ? "bg-gradient-to-br from-[#2a1b3d] to-[#1a1025] border border-brand-purple/50 shadow-[0_0_50px_-15px_rgba(191,166,255,0.3)]" 
                    : "bg-gradient-to-br from-[#1b3d2a] to-[#10251a] border border-brand-green/50 shadow-[0_0_50px_-15px_rgba(163,230,165,0.3)]"
            }`}>
                
                {prediction ? (
                    <div className="relative z-10 text-center">
                        <p className="text-gray-400 font-bold mb-6 uppercase tracking-widest text-xs">Probabilité de départ</p>
                        
                        <div className={`text-8xl font-black mb-4 tracking-tighter transition-all duration-500 ${
                            prediction.churn_probability > 0.5 ? "text-brand-purple drop-shadow-[0_0_15px_rgba(191,166,255,0.5)]" : "text-brand-green drop-shadow-[0_0_15px_rgba(163,230,165,0.5)]"
                        }`}>
                            {(prediction.churn_probability * 100).toFixed(0)}<span className="text-4xl opacity-50">%</span>
                        </div>

                        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold border ${
                            prediction.churn_probability > 0.5 
                            ? "bg-brand-purple/10 text-brand-purple border-brand-purple/20" 
                            : "bg-brand-green/10 text-brand-green border-brand-green/20"
                        }`}>
                            {prediction.churn_probability > 0.5 ? <AlertTriangle size={18}/> : <CheckCircle size={18}/>}
                            {prediction.churn_probability > 0.5 ? "RISQUE ÉLEVÉ" : "PROFIL STABLE"}
                        </div>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-600">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                            <LayoutDashboard size={32} strokeWidth={1.5}/>
                        </div>
                        <p className="font-medium text-sm">En attente de données...</p>
                    </div>
                )}
            </div>

            {/* 2. CARTE PLAN DE RÉTENTION (GenAI) */}
            {plan.length > 0 && (
                <div className="bg-[#f0f2f5] text-gray-900 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-700 border border-white/20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-purple/30">
                            <Sparkles size={20} className="fill-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-tight text-gray-900">Plan d'Action IA</h3>
                            <p className="text-gray-500 text-xs font-medium">Recommandé par Gemini Pro</p>
                        </div>
                    </div>
                    
                    <div className="space-y-0 relative pl-2">
                        {/* Ligne verticale de timeline */}
                        <div className="absolute left-[19px] top-3 bottom-6 w-0.5 bg-gray-300"></div>

                        {plan.map((action, i) => (
                            <div key={i} className="relative pl-12 pb-8 last:pb-0 group">
                                {/* Point sur la timeline */}
                                <div className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white border-4 border-brand-purple rounded-full z-10 shadow-sm group-hover:scale-125 transition-transform"></div>
                                </div>
                                
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h4 className="font-bold text-xs uppercase mb-1 text-brand-purple tracking-wider">Action {i+1}</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Widget Info */}
            <div className="bg-card/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                        <Activity size={16} className="text-green-500"/>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Modèle ML</p>
                        <p className="text-sm font-bold text-white">Random Forest v1.2</p>
                    </div>
                 </div>
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>

        </div>
      </div>
    </div>
  );
}