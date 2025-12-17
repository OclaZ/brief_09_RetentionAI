"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserPlus, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation simple
    if (!formData.username || !formData.password) {
        setError("Tous les champs sont requis.");
        return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Appel au Backend
      await axios.post("http://127.0.0.1:8000/auth/register", formData);
      
      // Succès
      setSuccess(true);
      
      // Redirection automatique après 2 secondes
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError("Ce nom d'utilisateur existe déjà.");
      } else {
        setError("Erreur serveur. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      
      {/* Effets de lumière en arrière-plan (Même que Login) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-6 z-10">
        <div className="backdrop-blur-xl bg-card/40 border border-white/10 rounded-3xl p-8 shadow-2xl">
            
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-green mb-6 shadow-lg shadow-brand-purple/20">
                    <UserPlus className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Créer un compte</h1>
                <p className="text-gray-400 text-sm">Rejoignez la plateforme RetentionAI</p>
            </div>

            {success ? (
                // --- ÉCRAN DE SUCCÈS ---
                <div className="text-center py-8 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Compte créé !</h3>
                    <p className="text-gray-400 text-sm">Redirection vers la connexion...</p>
                </div>
            ) : (
                // --- FORMULAIRE D'INSCRIPTION ---
                <div className="space-y-5">
                    <Input 
                        label="Choisissez un Identifiant" 
                        placeholder="ex: hr_admin" 
                        value={formData.username}
                        onChange={(e: any) => setFormData({...formData, username: e.target.value})}
                    />
                    <Input 
                        label="Mot de passe" 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e: any) => setFormData({...formData, password: e.target.value})}
                    />
                    
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    <div className="pt-2">
                        <Button onClick={handleRegister} isLoading={loading}>
                            <span>S'inscrire maintenant</span>
                            <ArrowRight size={18} />
                        </Button>
                    </div>
                </div>
            )}
            
            <div className="mt-8 text-center pt-6 border-t border-white/5">
                <p className="text-sm text-gray-400">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-brand-green hover:text-brand-purple font-bold transition-colors hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}