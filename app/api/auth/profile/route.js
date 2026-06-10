/**
 * PUT /api/auth/profile
 * Update user profile
 */

import { NextResponse } from 'next/server';
import User from '@/lib/models/User.js';
import Joi from 'joi';
import { requireAuth } from '@/lib/auth.js';

const updateProfileSchema = Joi.object({
  full_name: Joi.string().max(100).optional().allow(null, ''),
  email: Joi.string().email().required()
});

export async function PUT(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const { error, value } = updateProfileSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.details },
        { status: 400 }
      );
    }

    // Check if email is already used by another user
    const existingUser = await User.findByEmail(value.email);
    if (existingUser && existingUser.id !== user.userId) {
      return NextResponse.json(
        { success: false, message: 'Email sudah digunakan' },
        { status: 409 }
      );
    }

    const updatedUser = await User.updateProfile(user.userId, value);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
