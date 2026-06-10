/**
 * Password hashing and verification utilities
 * Uses bcrypt for secure password handling
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  if (plainPassword.trim() === '') {
    throw new Error('Password cannot be empty');
  }

  try {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare plain password with hash
 */
export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('Password is required and must be a string');
  }
  if (!hashedPassword || typeof hashedPassword !== 'string') {
    throw new Error('Hashed password is required and must be a string');
  }

  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Password comparison failed:', error);
    throw new Error('Failed to compare password');
  }
}
