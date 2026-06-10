/**
 * POST /api/auth/register
 * Register a new user
 */

import { NextResponse } from 'next/server';
import User from '@/lib/models/User.js';
import { registerSchema } from '@/lib/utils/schemas.js';
import { setSession } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const { error, value } = registerSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.details },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(value.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create(value);

    // Set session
    await setSession(user);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
