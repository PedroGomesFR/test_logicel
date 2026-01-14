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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mes Réservations</h1>
      {bookings.length === 0 ? (
        <p>Aucune réservation</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Salle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => (
                  <TableRow key={booking._id}>
                    <TableCell>{getRoomName(booking)}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Bookings;