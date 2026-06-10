/**
 * POST /api/auth/logout
 * Logout user
 */

import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth.js';

export async function POST(request) {
  try {
    await clearSession();

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
