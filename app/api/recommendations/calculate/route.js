/**
 * POST /api/recommendations/calculate
 * Calculate feed recommendation - works for both authenticated and guest users
 */

import { NextResponse } from 'next/server';
import { calculate } from '@/lib/fuzzy/fuzzyLogic.js';
import { getAuthUser } from '@/lib/auth.js';
import { calculateSchema } from '@/lib/utils/schemas.js';

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

    // Use default species data based on jenis_udang or species_id
    let speciesData = null;
    let jenis_udang = body.jenis_udang || 'Vannamei';

    // Default species data from hardcoded values
    const DEFAULT_SPECIES = {
      'Vannamei': { fcr: 1.2, growth_rate: 0.0015 },
      'Monodon': { fcr: 1.5, growth_rate: 0.0012 },
      'Lainnya': { fcr: 1.4, growth_rate: 0.0013 }
    };

    speciesData = DEFAULT_SPECIES[jenis_udang] || DEFAULT_SPECIES['Vannamei'];

    // Calculate using fuzzy logic
    const result = calculate(
      {
        ph_air: value.ph_air,
        suhu_air: value.suhu_air,
        cuaca: value.cuaca,
        volume_air: value.volume_air,
        jumlah_udang: value.jumlah_udang,
        usia_udang: value.usia_udang,
        jenis_udang: jenis_udang
      },
      speciesData
    );

    // Save to database only if user is authenticated
    let savedRecommendation = null;
    if (user) {
      // Import here only if needed to avoid loading for guest users
      const Recommendation = (await import('@/lib/models/Recommendation.js')).default;
      const SpeciesTypes = (await import('@/lib/models/SpeciesTypes.js')).default;

      let species_id = null;
      const species = await SpeciesTypes.findByName(jenis_udang);
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
        species_name: jenis_udang,
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
