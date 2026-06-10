/**
 * GET /api/recommendations
 * List user's recommendations
 */

import { NextResponse } from 'next/server';
import Recommendation from '@/lib/models/Recommendation.js';
import { requireAuth } from '@/lib/auth.js';

export async function GET(request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const tambak_id = searchParams.get('tambak_id');

    const recommendations = await Recommendation.findByUserId(user.userId, {
      page,
      limit,
      tambak_id: tambak_id ? parseInt(tambak_id) : undefined
    });

    return NextResponse.json({
      success: true,
      data: recommendations,
      pagination: { page, limit }
    });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
