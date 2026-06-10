/**
 * Fuzzy Logic Engine (TambakAI)
 * Calculates feed recommendations using Sugeno method
 * Fokus: Udang Vannamei (Litopenaeus vannamei)
 */

import rules from './fuzzy.rules.js';

// Parameter udang Vannamei (satu-satunya spesies yang digunakan)
const VANNAMEI_PARAMS = {
  fcr: 1.2,              // Feed Conversion Ratio untuk Vannamei
  growth_rate: 0.0015    // Growth rate per hari untuk Vannamei
};

// Triangular membership function
function triangularMembership(x, min, peak, max) {
  if (x <= min || x >= max) return 0;
  if (x === peak) return 1;
  if (x < peak) return (x - min) / (peak - min);
  return (max - x) / (max - peak);
}

// Fuzzy sets
const FUZZY_SETS = {
  ph: {
    asam: { min: 0, peak: 5, max: 7 },
    normal: { min: 6, peak: 7.5, max: 9 },
    basa: { min: 8, peak: 11, max: 14 }
  },
  suhu: {
    dingin: { min: 20, peak: 24, max: 27 },
    normal: { min: 25, peak: 28, max: 31 },
    panas: { min: 29, peak: 33, max: 35 }
  },
  cuaca: {
    cerah: 1.0,
    berawan: 0.8,
    hujan: 0.5,
    badai: 0.2
  },
  kepadatan: {
    rendah: { min: 0, peak: 10, max: 20 },
    normal: { min: 15, peak: 25, max: 35 },
    tinggi: { min: 30, peak: 50, max: 100 }
  },
  usia: {
    benur: { min: 1, peak: 30, max: 60 },
    pembesaran: { min: 45, peak: 90, max: 120 },
    panen: { min: 100, peak: 140, max: 180 }
  }
};

/**
 * Fuzzify inputs into membership values
 */
function fuzzify(inputs) {
  const { ph_air, suhu_air, cuaca, volume_air, jumlah_udang, usia_udang } = inputs;
  const kepadatan = jumlah_udang / volume_air;

  return {
    ph: {
      asam: triangularMembership(ph_air, FUZZY_SETS.ph.asam.min, FUZZY_SETS.ph.asam.peak, FUZZY_SETS.ph.asam.max),
      normal: triangularMembership(ph_air, FUZZY_SETS.ph.normal.min, FUZZY_SETS.ph.normal.peak, FUZZY_SETS.ph.normal.max),
      basa: triangularMembership(ph_air, FUZZY_SETS.ph.basa.min, FUZZY_SETS.ph.basa.peak, FUZZY_SETS.ph.basa.max)
    },
    suhu: {
      dingin: triangularMembership(suhu_air, FUZZY_SETS.suhu.dingin.min, FUZZY_SETS.suhu.dingin.peak, FUZZY_SETS.suhu.dingin.max),
      normal: triangularMembership(suhu_air, FUZZY_SETS.suhu.normal.min, FUZZY_SETS.suhu.normal.peak, FUZZY_SETS.suhu.normal.max),
      panas: triangularMembership(suhu_air, FUZZY_SETS.suhu.panas.min, FUZZY_SETS.suhu.panas.peak, FUZZY_SETS.suhu.panas.max)
    },
    cuaca: {
      cerah: cuaca.toLowerCase() === 'cerah' ? 1 : 0,
      berawan: cuaca.toLowerCase() === 'berawan' ? 1 : 0,
      hujan: cuaca.toLowerCase() === 'hujan' ? 1 : 0,
      badai: cuaca.toLowerCase() === 'badai' ? 1 : 0
    },
    kepadatan: {
      rendah: triangularMembership(kepadatan, FUZZY_SETS.kepadatan.rendah.min, FUZZY_SETS.kepadatan.rendah.peak, FUZZY_SETS.kepadatan.rendah.max),
      normal: triangularMembership(kepadatan, FUZZY_SETS.kepadatan.normal.min, FUZZY_SETS.kepadatan.normal.peak, FUZZY_SETS.kepadatan.normal.max),
      tinggi: triangularMembership(kepadatan, FUZZY_SETS.kepadatan.tinggi.min, FUZZY_SETS.kepadatan.tinggi.peak, FUZZY_SETS.kepadatan.tinggi.max)
    },
    usia: {
      benur: triangularMembership(usia_udang, FUZZY_SETS.usia.benur.min, FUZZY_SETS.usia.benur.peak, FUZZY_SETS.usia.benur.max),
      pembesaran: triangularMembership(usia_udang, FUZZY_SETS.usia.pembesaran.min, FUZZY_SETS.usia.pembesaran.peak, FUZZY_SETS.usia.pembesaran.max),
      panen: triangularMembership(usia_udang, FUZZY_SETS.usia.panen.min, FUZZY_SETS.usia.panen.peak, FUZZY_SETS.usia.panen.max)
    }
  };
}

/**
 * Evaluate fuzzy rules
 */
function evaluateRules(memberships) {
  const activeRules = [];
  for (const rule of rules) {
    const strength = Number(rule.conditions(memberships)); // true -> 1, false -> 0
    if (strength > 0) {
      activeRules.push({ ...rule.then, strength });
    }
  }
  return activeRules;
}

/**
 * Defuzzify using weighted average
 */
function defuzzify(activeRules) {
  if (activeRules.length === 0) return { adjustment: 1.0, feeding_rate: 0.04 };

  let totalWeight = 0;
  let adjustmentSum = 0;
  let feedingRateSum = 0;

  for (const rule of activeRules) {
    totalWeight += rule.strength;
    adjustmentSum += rule.adjustment * rule.strength;
    if (rule.feeding_rate) {
      feedingRateSum += rule.feeding_rate * rule.strength;
    }
  }

  const adjustment = totalWeight > 0 ? adjustmentSum / totalWeight : 1.0;
  const feeding_rate = feedingRateSum > 0 ? feedingRateSum / totalWeight : 0.04;

  return { adjustment, feeding_rate };
}

/**
 * Estimate shrimp weight based on age and growth rate
 */
function estimateWeight(usia_udang, growth_rate) {
  const baseWeight = 0.001; // kg
  const days = usia_udang;
  return baseWeight * Math.exp(growth_rate * (days / 30));
}

/**
 * Get Vannamei parameters (hanya satu spesies yang digunakan)
 */
function getVannameiParams(speciesData = null) {
  return speciesData || VANNAMEI_PARAMS;
}

/**
 * Format membership values for display
 */
function formatMemberships(memberships) {
  return {
    ph: {
      asam: memberships.ph.asam.toFixed(3),
      normal: memberships.ph.normal.toFixed(3),
      basa: memberships.ph.basa.toFixed(3)
    },
    suhu: {
      dingin: memberships.suhu.dingin.toFixed(3),
      normal: memberships.suhu.normal.toFixed(3),
      panas: memberships.suhu.panas.toFixed(3)
    },
    cuaca: {
      cerah: memberships.cuaca.cerah,
      berawan: memberships.cuaca.berawan,
      hujan: memberships.cuaca.hujan,
      badai: memberships.cuaca.badai
    },
    kepadatan: {
      rendah: memberships.kepadatan.rendah.toFixed(3),
      normal: memberships.kepadatan.normal.toFixed(3),
      tinggi: memberships.kepadatan.tinggi.toFixed(3)
    },
    usia: {
      benur: memberships.usia.benur.toFixed(3),
      pembesaran: memberships.usia.pembesaran.toFixed(3),
      panen: memberships.usia.panen.toFixed(3)
    }
  };
}

/**
 * Format active rules for display
 */
function formatActiveRules(activeRules) {
  return activeRules.map(rule => ({
    strength: Number(rule.strength ?? 0).toFixed(3),
    adjustment: rule.adjustment != null ? Number(rule.adjustment).toFixed(3) : '-',
    feeding_rate: rule.feeding_rate != null ? Number(rule.feeding_rate).toFixed(3) : '-',
    reason: rule.reason || ''
  }));
}

/**
 * Main calculation function
 * @param {Object} inputs - Input parameters (ph_air, suhu_air, cuaca, volume_air, jumlah_udang, usia_udang)
 * @param {Object} speciesData - Species data (opsional, default Vannamei)
 * @returns {Object} Calculation results
 */
export function calculate(inputs, speciesData = null) {
  const { ph_air, suhu_air, cuaca, volume_air, jumlah_udang, usia_udang } = inputs;

  // Gunakan parameter Vannamei
  const { fcr, growth_rate: growthRate } = getVannameiParams(speciesData);
  const jenis_udang = 'Vannamei';

  // Fuzzy inference
  const memberships = fuzzify({ ph_air, suhu_air, cuaca, volume_air, jumlah_udang, usia_udang });
  const activeRules = evaluateRules(memberships);
  const { adjustment, feeding_rate } = defuzzify(activeRules);

  // Detail perhitungan untuk display
  const detailPerhitungan = {
    fuzzifikasi: {
      input: {
        ph_air: ph_air,
        suhu_air: suhu_air,
        cuaca: cuaca,
        volume_air: volume_air,
        jumlah_udang: jumlah_udang,
        usia_udang: usia_udang,
        kepadatan: (jumlah_udang / volume_air).toFixed(2)
      },
      memberships: formatMemberships(memberships)
    },
    rule_evaluation: {
      total_rules: rules.length,
      active_rules: formatActiveRules(activeRules)
    },
    defuzifikasi: {
      method: 'Weighted Average (Sugeno)',
      calculation: activeRules.length > 0 ? {
        adjustment: {
          total_weight: activeRules.reduce((sum, r) => sum + r.strength, 0).toFixed(3),
          weighted_sum: activeRules.reduce((sum, r) => sum + (r.adjustment || 0) * r.strength, 0).toFixed(3),
          result: adjustment.toFixed(3)
        },
        feeding_rate: {
          total_weight: activeRules.reduce((sum, r) => sum + (r.feeding_rate ? r.strength : 0), 0).toFixed(3),
          weighted_sum: activeRules.reduce((sum, r) => sum + (r.feeding_rate || 0) * r.strength, 0).toFixed(3),
          result: feeding_rate.toFixed(3)
        }
      } : null
    }
  };

  // Calculate biomass and feed
  const estimatedWeight = estimateWeight(usia_udang, growthRate);
  const biomass = jumlah_udang * estimatedWeight;
  const baseFeed = biomass * feeding_rate;
  const adjustedFeed = baseFeed * adjustment;
  const dailyFeed = adjustedFeed * fcr;

  // Generate feeding schedule
  const schedule = [
    { waktu: '06:00', jumlah: dailyFeed * 0.4, persen: 40 },
    { waktu: '12:00', jumlah: dailyFeed * 0.2, persen: 20 },
    { waktu: '18:00', jumlah: dailyFeed * 0.4, persen: 40 }
  ];

  const kepadatan = jumlah_udang / volume_air;

  // Generate explanation
  let penjelasan = `Kondisi Air:\n`;
  penjelasan += `• pH ${ph_air} → ${memberships.ph.normal > 0.5 ? 'Optimal' : 'Perlu perhatian'}\n`;
  penjelasan += `• Suhu ${suhu_air}°C → ${memberships.suhu.normal > 0.5 ? 'Ideal' : 'Perlu perhatian'}\n\n`;

  penjelasan += `Kondisi Tambak:\n`;
  penjelasan += `• Kepadatan: ${kepadatan.toFixed(1)} ekor/m³\n\n`;

  penjelasan += `Kondisi Udang:\n`;
  penjelasan += `• Jenis: ${jenis_udang || species.nama || 'Vannamei'}\n`;
  penjelasan += `• Usia: ${usia_udang} hari\n`;
  penjelasan += `• Estimasi berat: ${(estimatedWeight * 1000).toFixed(1)} gram\n`;
  penjelasan += `• Total biomassa: ${biomass.toFixed(1)} kg\n\n`;

  penjelasan += `Rekomendasi Pakan:\n`;
  penjelasan += `• Berdasarkan FCR ${fcr} dan feeding rate ${(feeding_rate * 100).toFixed(1)}%\n`;
  penjelasan += `• Faktor koreksi: ${(adjustment * 100).toFixed(0)}%\n`;

  return {
    kuantitas_pakan: Math.round(dailyFeed * 100) / 100,
    jadwal_pemberian: schedule.map(s => ({
      waktu: s.waktu,
      jumlah: Math.round(s.jumlah * 100) / 100,
      persen: s.persen
    })),
    penjelasan,
    analisis: {
      kepadatan_ekor_per_m3: Math.round(kepadatan * 10) / 10,
      biomassa_kg: Math.round(biomass * 100) / 100,
      feeding_rate_persen: Math.round(feeding_rate * 1000) / 100,
      fcr: fcr,
      faktor_koreksi: Math.round(adjustment * 100) / 100
    },
    detail_perhitungan: detailPerhitungan
  };
}

export { FUZZY_SETS };
