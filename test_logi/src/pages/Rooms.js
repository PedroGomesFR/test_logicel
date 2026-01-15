import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  const handleBook = async () => {
    if (selectedRoom && date && time) {
      try {
        const response = await fetch('http://localhost:5001/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ roomId: selectedRoom._id || selectedRoom.id, date, time }),
        });
        const data = await response.json();
        if (response.ok) {
          setDialogOpen(false);
          setSelectedRoom(null);
          setDate('');
          setTime('');
          alert('Réservation confirmée');
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error booking:', error);
        alert('Erreur lors de la réservation');
      }
    }
  };

  const openDialog = (room) => {
    setSelectedRoom(room);
    setDate('');
    setTime('');
    setDialogOpen(true);
  };

  const isBooked = (roomId, date, time) => {
    return bookings.some(b => b.roomId === roomId && b.date === date && b.time === time);
  };

  const getRoomIcon = (roomName) => {
    const icons = {
      'Salle A': (
        <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      'Salle B': (
        <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'Salle C': (
        <svg className="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    };
    return icons[roomName] || icons['Salle A'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-light text-stone-800 mb-3">Nos Espaces</h1>
          <p className="text-stone-500 font-light">Choisissez l'espace qui correspond à vos besoins</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map(room => (
            <Card
              key={room._id || room.id}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/60 backdrop-blur-sm overflow-hidden group"
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-stone-100 to-stone-200 mb-6 group-hover:from-stone-200 group-hover:to-stone-300 transition-all duration-300">
                  {getRoomIcon(room.name)}
                </div>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-light text-stone-800 mb-2">{room.name}</CardTitle>
                  <CardDescription className="text-stone-500 font-light flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Capacité: {room.capacity} personnes</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Dialog open={dialogOpen && (selectedRoom?._id === room._id || selectedRoom?.id === room.id)} onOpenChange={(open) => {
                    if (!open) {
                      setDialogOpen(false);
                      setSelectedRoom(null);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => openDialog(room)}
                        className="w-full bg-stone-800 hover:bg-stone-700 text-white font-light py-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Réserver
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 backdrop-blur-md border-stone-200">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-light text-stone-800">Réserver {selectedRoom?.name}</DialogTitle>
                        <DialogDescription className="text-stone-500 font-light">Choisissez la date et l'heure de votre réservation</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-stone-700 font-light text-sm">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border-stone-200 focus:border-stone-400 focus:ring-stone-300 bg-white/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time" className="text-stone-700 font-light text-sm">Heure</Label>
                          <Select onValueChange={setTime}>
                            <SelectTrigger className="bg-white/50 border-stone-200 focus:border-stone-400">
                              <SelectValue placeholder="Sélectionnez l'heure" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-stone-200">
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleBook}
                          disabled={!date || !time}
                          className="w-full bg-stone-800 hover:bg-stone-700 text-white font-light py-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirmer la réservation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rooms;