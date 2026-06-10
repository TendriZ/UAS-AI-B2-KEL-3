/**
 * POST /api/auth/login
 * Login user
 */

import { NextResponse } from 'next/server';
import User from '@/lib/models/User.js';
import { loginSchema } from '@/lib/utils/schemas.js';
import { setSession } from '@/lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const { error, value } = loginSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.details },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findByEmail(value.email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await User.verifyPassword(user, value.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Set session
    await setSession(user);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
