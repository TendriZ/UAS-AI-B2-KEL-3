'use client';

import { useState, useEffect } from 'react';
import { CUACA } from '@/lib/utils/schemas';
import styles from './InputForm.module.css';

export default function InputForm({ onSubmit, loading }) {
  const [speciesList, setSpeciesList] = useState([]);
  const [formData, setFormData] = useState({
    ph_air: '',
    suhu_air: '',
    cuaca: 'Cerah',
    volume_air: '',
    jenis_udang: 'Vannamei',
    jumlah_udang: '',
    usia_udang: '',
    notes: '',
  });

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    try {
      const res = await fetch('/api/species');
      const data = await res.json();

      if (data.success) {
        setSpeciesList(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch species:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      jenis_udang: formData.jenis_udang,
      jumlah_udang: jumlah,
      usia_udang: usia,
      notes: formData.notes,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        {/* pH Air */}
        <div>
          <label className={styles.label}>
            pH Air (0-14)
          </label>

          <input
            type="number"
            name="ph_air"
            step="0.1"
            value={formData.ph_air}
            onChange={handleChange}
            className={styles.input}
            placeholder="Contoh: 7.5"
            required
          />
        </div>

        {/* Suhu Air */}
        <div>
          <label className={styles.label}>
            Suhu Air (°C)
          </label>

          <input
            type="number"
            name="suhu_air"
            step="0.1"
            value={formData.suhu_air}
            onChange={handleChange}
            className={styles.input}
            placeholder="Contoh: 28"
            required
          />
        </div>

        {/* Cuaca */}
        <div>
          <label className={styles.label}>
            Cuaca
          </label>

          <select
            name="cuaca"
            value={formData.cuaca}
            onChange={handleChange}
            className={styles.input}
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
          <label className={styles.label}>
            Volume Air (m³)
          </label>

          <input
            type="number"
            name="volume_air"
            step="0.1"
            value={formData.volume_air}
            onChange={handleChange}
            className={styles.input}
            placeholder="Contoh: 1000"
            required
          />
        </div>

        {/* Jenis Udang */}
        <div>
          <label className={styles.label}>
            Jenis Udang
          </label>

          <select
            name="jenis_udang"
            value={formData.jenis_udang}
            onChange={handleChange}
            className={styles.input}
            required
          >
            {speciesList.length === 0 ? (
              <option value="Vannamei">
                Vannamei
              </option>
            ) : (
              speciesList.map((species) => (
                <option
                  key={species.id}
                  value={species.nama}
                >
                  {species.nama}
                  {species.nama_ilmiah
                    ? ` (${species.nama_ilmiah})`
                    : ''}
                </option>
              ))
            )}
          </select>

          {speciesList.length > 0 && (
            <p className={styles.speciesInfo}>
              FCR:{' '}
              {
                speciesList.find(
                  (s) => s.nama === formData.jenis_udang
                )?.fcr
              }
              {' | '}
              Growth:{' '}
              {(
                speciesList.find(
                  (s) => s.nama === formData.jenis_udang
                )?.growth_rate * 100
              ).toFixed(2)}
              %
            </p>
          )}
        </div>

        {/* Jumlah Udang */}
        <div>
          <label className={styles.label}>
            Jumlah Udang (ekor)
          </label>

          <input
            type="number"
            name="jumlah_udang"
            value={formData.jumlah_udang}
            onChange={handleChange}
            className={styles.input}
            placeholder="Contoh: 10000"
            required
          />
        </div>

        {/* Usia Udang */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Usia Udang (hari)
          </label>

          <input
            type="number"
            name="usia_udang"
            value={formData.usia_udang}
            onChange={handleChange}
            className={styles.input}
            placeholder="Contoh: 60"
            required
          />
        </div>

        {/* Catatan */}
        <div className={styles.fullWidth}>
          <label className={styles.label}>
            Catatan (Opsional)
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            maxLength={500}
            placeholder="Catatan tambahan..."
            className={styles.textarea}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading
          ? 'Menghitung...'
          : '🧮 Hitung Rekomendasi'}
      </button>
    </form>
  );
}