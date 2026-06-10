/**
 * Fuzzy Sets Configuration
 * Defines membership functions for each input variable
 */

export default {
  // pH sets (range: 0-14)
  ph: {
    asam: { min: 0, peak: 5, max: 7 },
    normal: { min: 6, peak: 7.5, max: 9 },
    basa: { min: 8, peak: 11, max: 14 }
  },

  // Suhu sets (range: 20-35°C)
  suhu: {
    dingin: { min: 20, peak: 24, max: 27 },
    normal: { min: 25, peak: 28, max: 31 },
    panas: { min: 29, peak: 33, max: 35 }
  },

  // Cuaca sets (discrete)
  cuaca: {
    cerah: 1.0,
    berawan: 0.8,
    hujan: 0.5,
    badai: 0.2
  },

  // Kepadatan sets (ekor/m³)
  kepadatan: {
    rendah: { min: 0, peak: 10, max: 20 },
    normal: { min: 15, peak: 25, max: 35 },
    tinggi: { min: 30, peak: 50, max: 100 }
  },

  // Usia sets (hari)
  usia: {
    benur: { min: 1, peak: 30, max: 60 },
    pembesaran: { min: 45, peak: 90, max: 120 },
    panen: { min: 100, peak: 140, max: 180 }
  },

  // Jenis udang (discrete with FCR values)
  jenis: {
    vannamei: { fcr: 1.2, growth_rate: 0.15 },
    monodon: { fcr: 1.5, growth_rate: 0.12 },
    lainnya: { fcr: 1.4, growth_rate: 0.13 }
  }
};
