const mongoose = require('mongoose');
const Room = require('../models/Room');

describe('Room Model', () => {
  // Test unitaire 5: Validation - Nom de salle requis
  test('should require name field', () => {
    const roomSchema = Room.schema;
    const nameField = roomSchema.paths.name;
    expect(nameField.instance).toBe('String');
    expect(nameField.isRequired).toBe(true);
  });

  // Test unitaire  6: Validation - Capacité requise
  test('should require capacity field', () => {
    const roomSchema = Room.schema;
    const capacityField = roomSchema.paths.capacity;
    expect(capacityField.instance).toBe('Number');
    expect(capacityField.isRequired).toBe(true);
  });

  // Test unitaire  7: Validation - Capacité est un nombre
  test('capacity should be a number', () => {
    const roomSchema = Room.schema;
    const capacityField = roomSchema.paths.capacity;
    expect(capacityField.instance).toBe('Number');
  });
});
