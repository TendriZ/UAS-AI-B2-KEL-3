/**
 * GET/PUT/DELETE /api/tambak/:id
 * Get, update, or delete a specific tambak
 */

import { NextResponse } from 'next/server';
import Tambak from '@/lib/models/Tambak.js';
import { tambakSchema } from '@/lib/utils/schemas.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const tambak = await Tambak.findById(params.id, user.userId);

    if (!tambak) {
      return NextResponse.json(
        { success: false, message: 'Tambak not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tambak
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Get tambak error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const tambak = await Tambak.update(params.id, user.userId, value);

    if (!tambak) {
      return NextResponse.json(
        { success: false, message: 'Tambak not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tambak updated successfully',
      data: tambak
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Update tambak error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const tambak = await Tambak.softDelete(params.id, user.userId);

    if (!tambak) {
      return NextResponse.json(
        { success: false, message: 'Tambak not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tambak deleted successfully'
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Delete tambak error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
