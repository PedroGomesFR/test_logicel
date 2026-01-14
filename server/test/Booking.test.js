const mongoose = require('mongoose');
const Booking = require('../models/Booking');

describe('Booking Model', () => {
  // Test 8: Validation - userId requis
  test('should require userId field', () => {
    const bookingSchema = Booking.schema;
    const userIdField = bookingSchema.paths.userId;
    expect(userIdField.isRequired).toBe(true);
  });

  // Test 9: Validation - roomId requis
  test('should require roomId field', () => {
    const bookingSchema = Booking.schema;
    const roomIdField = bookingSchema.paths.roomId;
    expect(roomIdField.isRequired).toBe(true);
  });

  // Test 10: Validation - date et heure requises
  test('should require date and time fields', () => {
    const bookingSchema = Booking.schema;
    const dateField = bookingSchema.paths.date;
    const timeField = bookingSchema.paths.time;
    expect(dateField.instance).toBe('String');
    expect(dateField.isRequired).toBe(true);
    expect(timeField.instance).toBe('String');
    expect(timeField.isRequired).toBe(true);
  });
});
