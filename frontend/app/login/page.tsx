"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // <--- IMPORT AJOUTÉ
import axios from "axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError("Accès refusé. Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-6 z-10">
        <div className="backdrop-blur-xl bg-card/40 border border-white/10 rounded-3xl p-8 shadow-2xl">
            
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green to-brand-purple mb-6 shadow-lg shadow-brand-green/20">
                    <Sparkles className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">RetentionAI</h1>
                <p className="text-gray-400">Intelligence Artificielle RH</p>
            </div>

            <div className="space-y-5">
              <Input 
                label="Identifiant" 
                placeholder="hr_manager" 
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
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
              
              <div className="pt-4">
                <Button onClick={handleLogin} isLoading={loading}>
                  <span>Connexion Sécurisée</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
            
            {/* --- AJOUT DU LIEN VERS REGISTER ICI --- */}
            <div className="mt-8 text-center pt-6 border-t border-white/5">
                <p className="text-sm text-gray-400">
                    Pas encore de compte ?{' '}
                    <Link href="/register" className="text-brand-green hover:text-brand-purple font-bold transition-colors hover:underline">
                        Créer un compte
                    </Link>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}