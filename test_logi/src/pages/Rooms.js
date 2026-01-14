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
          body: JSON.stringify({ roomId: selectedRoom._id, date, time }),
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Salles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rooms.map(room => (
          <Card key={room._id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>Capacité: {room.capacity}</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openDialog(room)}>Réserver</Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Réserver {selectedRoom?.name}</DialogTitle>
                    <DialogDescription>Choisissez la date et l'heure</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Heure</Label>
                      <Select onValueChange={setTime}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Sélectionnez l'heure" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="09:00">09:00</SelectItem>
                          <SelectItem value="10:00">10:00</SelectItem>
                          <SelectItem value="11:00">11:00</SelectItem>
                          <SelectItem value="14:00">14:00</SelectItem>
                          <SelectItem value="15:00">15:00</SelectItem>
                          <SelectItem value="16:00">16:00</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleBook} disabled={!date || !time}>
                      Confirmer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;