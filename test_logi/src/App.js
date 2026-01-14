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
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const Nav = () => {
  const { user, logout, loading } = useAuth();
  if (loading) return null;
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">EasyBooking</h1>
        {user && (
          <div className="flex items-center">
            <a href="/rooms" className="mr-4">Salles</a>
            <a href="/bookings" className="mr-4">Réservations</a>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Déconnexion</button>
          </div>
        )}
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
