/**
 * POST /api/recommendations/calculate
 * Calculate feed recommendation - works for both authenticated and guest users
 * Fokus: Udang Vannamei
 */

import { NextResponse } from 'next/server';
import { calculate } from '@/lib/fuzzy/fuzzyLogic.js';
import { getAuthUser } from '@/lib/auth.js';
import { calculateSchema } from '@/lib/utils/schemas.js';

// Parameter Vannamei (konstan)
const VANNAMEI_PARAMS = {
  fcr: 1.2,
  growth_rate: 0.0015
};

export async function POST(request) {
  try {
    // Get user if authenticated, but allow guest users too
    const user = await getAuthUser();
    const body = await request.json();

    // Validate input
    const { error, value } = calculateSchema.validate(body);
    if (error) {
      console.log('Validation error:', error.details);
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.details },
        { status: 400 }
      );
    }

    // Calculate using fuzzy logic (Vannamei)
    const result = calculate(
      {
        ph_air: value.ph_air,
        suhu_air: value.suhu_air,
        cuaca: value.cuaca,
        volume_air: value.volume_air,
        jumlah_udang: value.jumlah_udang,
        usia_udang: value.usia_udang
      },
      VANNAMEI_PARAMS
    );

    // Save to database only if user is authenticated
    let savedRecommendation = null;
    if (user) {
      // Import here only if needed to avoid loading for guest users
      const Recommendation = (await import('@/lib/models/Recommendation.js')).default;
      const SpeciesTypes = (await import('@/lib/models/SpeciesTypes.js')).default;

      // Get Vannamei species ID
      let species_id = null;
      const species = await SpeciesTypes.findByName('Vannamei');
      if (species) {
        species_id = species.id;
      }

      savedRecommendation = await Recommendation.create({
        user_id: user.userId,
        tambak_id: value.tambak_id || null,
        species_id: species_id,
        ph_air: value.ph_air,
        suhu_air: value.suhu_air,
        cuaca: value.cuaca,
        volume_air: value.volume_air,
        jumlah_udang: value.jumlah_udang,
        usia_udang: value.usia_udang,
        kuantitas_pakan: result.kuantitas_pakan,
        jadwal_pemberian: result.jadwal_pemberian,
        penjelasan: result.penjelasan,
        faktor_koreksi: result.analisis.faktor_koreksi,
        biomassa_kg: result.analisis.biomassa_kg,
        feeding_rate_persen: result.analisis.feeding_rate_persen,
        notes: value.notes || null
      });
    }

    return NextResponse.json({
      success: true,
      message: user ? 'Recommendation calculated and saved' : 'Recommendation calculated (not saved - guest mode)',
      data: {
        id: savedRecommendation?.id,
        created_at: savedRecommendation?.created_at,
        is_guest: !user,
        species_name: 'Vannamei',
        ...result
      }
    }, { status: 201 });

  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    console.error('Calculate recommendation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
