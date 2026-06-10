/**
 * GET/DELETE /api/recommendations/:id
 * Get or delete a specific recommendation
 */

import { NextResponse } from 'next/server';
import Recommendation from '@/lib/models/Recommendation.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(request, { params }) {
  try {
    const user = await requireAuth();
    const recommendation = await Recommendation.findById(params.id, user.userId);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, message: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: recommendation
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Get recommendation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();
    const recommendation = await Recommendation.delete(params.id, user.userId);

    if (!recommendation) {
      return NextResponse.json(
        { success: false, message: 'Recommendation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Delete recommendation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
