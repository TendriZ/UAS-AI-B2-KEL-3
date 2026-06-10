'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import InputForm from '@/components/InputForm';
import ResultCard from '@/components/ResultCard';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🦐 TambakAI
            </h1>
            <p className="text-gray-600">
              Sistem Kontrol Pemberian Makan Pada Tambak Udang dengan Fuzzy Logic
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Input Parameter Tambak
            </h2>
            <InputForm
              onSubmit={handleCalculate}
              loading={loading}
            />
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
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
