import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookings', {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    if (getToken()) {
      fetchBookings();
    }
  }, [getToken]);

  const getRoomName = (booking) => {
    return booking.roomId ? booking.roomId.name : 'Unknown';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-stone-800 mb-3">Mes Réservations</h1>
          <p className="text-stone-500 font-light">Consultez toutes vos réservations en cours</p>
        </div>
        
        {bookings.length === 0 ? (
          <Card className="border-0 shadow-md bg-white/60 backdrop-blur-sm">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-6">
                <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-light text-stone-700 mb-2">Aucune réservation</h3>
              <p className="text-stone-500 font-light mb-6">Vous n'avez pas encore de réservation</p>
              <a href="/rooms" className="inline-block text-stone-700 hover:text-stone-900 font-light underline underline-offset-2 transition-colors">
                Réserver une salle
              </a>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <Card 
                key={booking._id} 
                className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/60 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-6">
                      <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200">
                        <svg className="w-8 h-8 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-light text-stone-800 mb-2">{getRoomName(booking)}</h3>
                        <div className="flex flex-col space-y-2 text-stone-600 font-light">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{formatDate(booking.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;