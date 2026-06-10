/**
 * GET /api/species
 * Get list of shrimp species types
 */

import { NextResponse } from 'next/server';
import SpeciesTypes from '@/lib/models/SpeciesTypes.js';

export async function GET(request) {
  try {
    // Initialize default species if not exists
    await SpeciesTypes.initializeDefaults();

    const species = await SpeciesTypes.getAll();

    return NextResponse.json({
      success: true,
      data: species
    });

  } catch (error) {
    console.error('Get species error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
