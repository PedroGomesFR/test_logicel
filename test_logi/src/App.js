import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
          <p className="text-sm text-stone-500 font-light">Chargement...</p>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

const Nav = () => {
  const { user, logout, loading } = useAuth();
  if (loading) return null;
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-stone-200/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-400 to-stone-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-xl font-light tracking-tight text-stone-800">EasyBooking</h1>
          </div>
          {user && (
            <div className="flex items-center space-x-6">
              <a href="/rooms" className="text-sm font-light text-stone-600 hover:text-stone-900 transition-colors duration-200">Salles</a>
              <a href="/bookings" className="text-sm font-light text-stone-600 hover:text-stone-900 transition-colors duration-200">Réservations</a>
              <div className="h-6 w-px bg-stone-300"></div>
              <span className="text-sm text-stone-500">{user.name || user.email}</span>
              <button 
                onClick={logout} 
                className="text-sm font-light text-stone-500 hover:text-stone-800 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/rooms" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
