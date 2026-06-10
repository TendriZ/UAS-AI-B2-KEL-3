/**
 * GET/POST /api/tambak
 * List tambaks or create new tambak
 */

import { NextResponse } from 'next/server';
import Tambak from '@/lib/models/Tambak.js';
import { tambakSchema } from '@/lib/utils/schemas.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(request) {
  try {
    const user = await requireAuth();

    const tambaks = await Tambak.findByUserId(user.userId);

    return NextResponse.json({
      success: true,
      data: tambaks
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Get tambaks error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    // Validate input
    const { error, value } = tambakSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.details },
        { status: 400 }
      );
    }

    const tambak = await Tambak.create({
      user_id: user.userId,
      ...value
    });

    return NextResponse.json({
      success: true,
      message: 'Tambak created successfully',
      data: tambak
    }, { status: 201 });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Create tambak error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
