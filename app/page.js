'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import InputForm from '@/components/InputForm/InputForm';
import ResultCard from '@/components/ResultCard/ResultCard';
import styles from './Home.module.css';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recommendations/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Gagal menghitung rekomendasi');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className={styles.page}>
    <Navbar />

    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            🦐 Si Tambak
          </h1>

          <p className={styles.subtitle}>
            Sistem Kontrol Pemberian Makan Pada Tambak Udang dengan Fuzzy Logic
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Input Parameter Tambak
          </h2>

          <InputForm
            onSubmit={handleCalculate}
            loading={loading}
          />
        </div>

        {result && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              Hasil Rekomendasi
            </h2>

            <ResultCard data={result} />
          </div>
        )}
      </div>
    </main>
  </div>
);
}