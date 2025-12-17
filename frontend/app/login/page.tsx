"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Remplace par ton URL Backend
      const res = await axios.post("http://127.0.0.1:8000/auth/login", formData);
      localStorage.setItem("token", res.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError("Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Cercles décoratifs en arrière plan comme l'image */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl"></div>

      <Card className="w-full max-w-md backdrop-blur-sm bg-card/80 border-gray-700/50">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-brand-green rounded-2xl flex items-center justify-center mb-4 text-gray-900">
                <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold">RetentionAI</h1>
            <p className="text-gray-400 text-sm">Portail RH Sécurisé</p>
        </div>

        <div className="space-y-4">
          <Input 
            label="Nom d'utilisateur" 
            placeholder="ex: hr_manager" 
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
          
          {error && <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg">{error}</p>}
          
          <div className="pt-4">
            <Button onClick={handleLogin} isLoading={loading}>Se connecter</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}