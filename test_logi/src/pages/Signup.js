import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
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
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-stone-400 to-stone-600 mb-6 shadow-lg shadow-stone-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-stone-800 mb-2">Créer un compte</h1>
          <p className="text-stone-500 font-light">Rejoignez-nous dès aujourd'hui</p>
        </div>

        <Card className="border-0 shadow-xl shadow-stone-200/50 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-stone-700 font-light text-sm">Nom</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-stone-200 focus:border-stone-400 focus:ring-stone-300 bg-white/50"
                  placeholder="Votre nom"
                />
              </div>
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
                S'inscrire
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-500 font-light">
              Déjà un compte? <a href="/login" className="text-stone-700 hover:text-stone-900 underline underline-offset-2 transition-colors">Se connecter</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;