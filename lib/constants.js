/**
 * Application Constants
 * TambakAI - Sistem Kontrol Pemberian Makan Pada Tambak Udang
 * Fokus: Udang Vannamei (Litopenaeus vannamei)
 */

export const CUACA = Object.freeze(['Cerah', 'Berawan', 'Hujan', 'Badai']);

// Udang Vannamei - Parameter standar untuk perhitungan
export const VANNAMEI_PARAMS = Object.freeze({
  nama: 'Vannamei',
  nama_ilmiah: 'Litopenaeus vannamei',
  fcr: 1.2,              // Feed Conversion Ratio
  growth_rate: 0.0015    // Growth rate per hari
});

export const FUZZY_SETS = Object.freeze({
  PH: Object.freeze(['Asam', 'Normal', 'Basa']),
  SUHU: Object.freeze(['Dingin', 'Normal', 'Panas']),
  CUACA: Object.freeze(['Cerah', 'Berawan', 'Hujan', 'Badai']),
  KEPADATAN: Object.freeze(['Rendah', 'Normal', 'Tinggi']),
  USIA: Object.freeze(['Benur', 'Pembesaran', 'Panen'])
});
