/**
 * Fuzzy Rules for Feed Recommendation
 * Format: [conditions] => { feeding_rate_adjustment, description }
 */

export default [
  // pH-based rules
  {
    conditions: (m) => m.ph.asam > 0.5,
    then: { adjustment: 0.7, reason: 'pH asam tingkatkan stres, kurangi pakan' }
  },
  {
    conditions: (m) => m.ph.basa > 0.5,
    then: { adjustment: 0.8, reason: 'pH basa tingkatkan stres, kurangi pakan' }
  },
  {
    conditions: (m) => m.ph.normal > 0.5,
    then: { adjustment: 1.0, reason: 'pH optimal' }
  },

  // Suhu-based rules
  {
    conditions: (m) => m.suhu.dingin > 0.5,
    then: { adjustment: 0.8, reason: 'Suhu dingat, metabolisme udang menurun' }
  },
  {
    conditions: (m) => m.suhu.panas > 0.5,
    then: { adjustment: 0.85, reason: 'Suhu panas tingkatkan stres' }
  },
  {
    conditions: (m) => m.suhu.normal > 0.5,
    then: { adjustment: 1.0, reason: 'Suhu optimal' }
  },

  // Cuaca-based rules
  {
    conditions: (m) => m.cuaca.hujan > 0.5 || m.cuaca.badai > 0.5,
    then: { adjustment: 0.7, reason: 'Cuaca buruk, nafsu makan menurun' }
  },
  {
    conditions: (m) => m.cuaca.berawan > 0.5,
    then: { adjustment: 0.9, reason: 'Cuaca berawan' }
  },
  {
    conditions: (m) => m.cuaca.cerah > 0.5,
    then: { adjustment: 1.0, reason: 'Cuaca cerah, nafsu makan baik' }
  },

  // Kepadatan-based rules
  {
    conditions: (m) => m.kepadatan.rendah > 0.5,
    then: { adjustment: 1.1, reason: 'Kepadatan rendah, tambah pakan untuk pertumbuhan' }
  },
  {
    conditions: (m) => m.kepadatan.tinggi > 0.5,
    then: { adjustment: 0.9, reason: 'Kepadatan tinggi, kurangi pakan hindari waste' }
  },
  {
    conditions: (m) => m.kepadatan.normal > 0.5,
    then: { adjustment: 1.0, reason: 'Kepadatan normal' }
  },

  // Usia-based rules
  {
    conditions: (m) => m.usia.benur > 0.5,
    then: { feeding_rate: 0.05, reason: 'Fase benur, feeding rate tinggi' }
  },
  {
    conditions: (m) => m.usia.pembesaran > 0.5,
    then: { feeding_rate: 0.04, reason: 'Fase pembesaran' }
  },
  {
    conditions: (m) => m.usia.panen > 0.5,
    then: { feeding_rate: 0.03, reason: 'Fase panen, feeding rate lebih rendah' }
  }
];
