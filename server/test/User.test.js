const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model', () => {
  // Test 1: Validation - Email requis
  test('should require email field', () => {
    const userSchema = User.schema;
    const emailField = userSchema.paths.email;
    expect(emailField.instance).toBe('String');
    expect(emailField.isRequired).toBe(true);
  });

  // Test unitaire 2: Validation - Email unique
  test('should have unique email constraint', () => {
    const userSchema = User.schema;
    const emailField = userSchema.paths.email;
    expect(emailField.options.unique).toBe(true);
  });

  // Test unitaire  3: Validation - Nom requis
  test('should require name field', () => {
    const userSchema = User.schema;
    const nameField = userSchema.paths.name;
    expect(nameField.instance).toBe('String');
    expect(nameField.isRequired).toBe(true);
  });

  // Test unitaire 4: Validation - Mot de passe requis
  test('should require password field', () => {
    const userSchema = User.schema;
    const passwordField = userSchema.paths.password;
    expect(passwordField.instance).toBe('String');
    expect(passwordField.isRequired).toBe(true);
  });
});
