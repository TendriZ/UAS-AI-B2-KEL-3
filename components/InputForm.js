'use client';

import { useState } from 'react';
import { CUACA } from '@/lib/utils/schemas';

export default function InputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    ph_air: '',
    suhu_air: '',
    cuaca: 'Cerah',
    volume_air: '',
    jumlah_udang: '',
    usia_udang: '',
    notes: ''
  });

  // Parameter Vannamei (konstan)
  const VANNAMEI_INFO = {
    nama: 'Vannamei',
    nama_ilmiah: 'Litopenaeus vannamei',
    fcr: 1.2,
    growth_rate: 0.0015
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const ph = parseFloat(formData.ph_air);
    const suhu = parseFloat(formData.suhu_air);
    const volume = parseFloat(formData.volume_air);
    const jumlah = parseInt(formData.jumlah_udang);
    const usia = parseInt(formData.usia_udang);

    if (isNaN(ph) || ph < 0 || ph > 14) {
      alert('pH harus antara 0-14');
      return;
    }
    if (isNaN(suhu) || suhu < 0 || suhu > 50) {
      alert('Suhu harus antara 0-50°C');
      return;
    }
    if (isNaN(volume) || volume <= 0) {
      alert('Volume air harus lebih dari 0');
      return;
    }
    if (isNaN(jumlah) || jumlah <= 0) {
      alert('Jumlah udang harus lebih dari 0');
      return;
    }
    if (isNaN(usia) || usia < 1 || usia > 365) {
      alert('Usia udang harus antara 1-365 hari');
      return;
    }

    onSubmit({
      ph_air: ph,
      suhu_air: suhu,
      cuaca: formData.cuaca,
      volume_air: volume,
      jumlah_udang: jumlah,
      usia_udang: usia,
      notes: formData.notes
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vannamei Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦐</span>
          <div>
            <h3 className="font-semibold text-blue-800">{VANNAMEI_INFO.nama} ({VANNAMEI_INFO.nama_ilmiah})</h3>
            <p className="text-sm text-blue-600">
              FCR: {VANNAMEI_INFO.fcr} | Growth Rate: {(VANNAMEI_INFO.growth_rate * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Grid for inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* pH Air */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            pH Air (0-14)
          </label>
          <input
            type="number"
            name="ph_air"
            step="0.1"
            value={formData.ph_air}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 7.5"
            required
          />
        </div>

        {/* Suhu Air */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suhu Air (°C)
          </label>
          <input
            type="number"
            name="suhu_air"
            step="0.1"
            value={formData.suhu_air}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 28"
            required
          />
        </div>

        {/* Cuaca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuaca
          </label>
          <select
            name="cuaca"
            value={formData.cuaca}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CUACA.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Volume Air */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Volume Air (m³)
          </label>
          <input
            type="number"
            name="volume_air"
            step="0.1"
            value={formData.volume_air}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 1000"
            required
          />
        </div>

        {/* Jumlah Udang */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Udang (ekor)
          </label>
          <input
            type="number"
            name="jumlah_udang"
            value={formData.jumlah_udang}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 10000"
            required
          />
        </div>

        {/* Usia Udang */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usia Udang (hari)
          </label>
          <input
            type="number"
            name="usia_udang"
            value={formData.usia_udang}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: 60"
            required
          />
        </div>

        {/* Notes (Optional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            placeholder="Catatan tambahan..."
            maxLength={500}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? 'Menghitung...' : '🧮 Hitung Rekomendasi'}
      </button>
    </form>
  );
}
