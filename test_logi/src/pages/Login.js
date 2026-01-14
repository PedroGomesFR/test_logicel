import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user, data.token);
        navigate('/rooms');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-400 to-stone-600 mb-6 shadow-lg shadow-stone-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-stone-800 mb-2">Bienvenue</h1>
          <p className="text-stone-500 font-light">Connectez-vous à votre compte</p>
        </div>
        
        <Card className="border-0 shadow-xl shadow-stone-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-stone-700 font-light text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-stone-200 focus:border-stone-400 focus:ring-stone-300 bg-white/50"
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-stone-700 font-light text-sm">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-stone-200 focus:border-stone-400 focus:ring-stone-300 bg-white/50"
                  placeholder="••••••••"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-stone-800 hover:bg-stone-700 text-white font-light py-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Se connecter
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500 font-light">
              Pas de compte? <a href="/signup" className="text-stone-700 hover:text-stone-900 underline underline-offset-2 transition-colors">S'inscrire</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;