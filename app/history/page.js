'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import jsPDF from 'jspdf';

export default function HistoryPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRecommendations();
  }, [page]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommendations?page=${page}&limit=10`);
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.data);
      }
    } catch (error) {
      console.error('History error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus rekomendasi ini?')) return;

    try {
      const res = await fetch(`/api/recommendations/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRecommendations(recommendations.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus rekomendasi');
    }
  };

  const exportPDF = (rec) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Rekomendasi Pakan TambakAI', 20, 20);

    doc.setFontSize(12);
    doc.text(`Tanggal: ${new Date(rec.created_at).toLocaleDateString('id-ID')}`, 20, 30);

    doc.setFontSize(14);
    doc.text(`Kuantitas Pakan Harian: ${rec.kuantitas_pakan} kg`, 20, 45);

    const jadwal = typeof rec.jadwal_pemberian === 'string'
      ? JSON.parse(rec.jadwal_pemberian)
      : rec.jadwal_pemberian;

    doc.text('Jadwal Pemberian:', 20, 55);
    let yPos = 63;
    jadwal.forEach((j) => {
      doc.text(`${j.waktu} - ${j.jumlah} kg (${j.persen}%)`, 25, yPos);
      yPos += 8;
    });

    doc.save(`rekomendasi-${rec.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Riwayat Rekomendasi
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Buat Baru
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500 mb-4">
                Belum ada rekomendasi. Mulai hitung pakan untuk tambak Anda!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {new Date(rec.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <h3 className="font-semibold text-gray-800 mt-1">
                          {rec.species_name || rec.jenis_udang || 'Unknown'} - {rec.usia_udang} hari
                        </h3>
                        <p className="text-sm text-gray-600">
                          pH: {rec.ph_air} | Suhu: {rec.suhu_air}°C | Cuaca: {rec.cuaca}
                        </p>
                        <p className="text-sm text-gray-600">
                          Volume: {rec.volume_air} m³ | Jumlah: {rec.jumlah_udang} ekor
                        </p>
                        {rec.tambak_name && (
                          <p className="text-sm text-gray-500">
                            Tambak: {rec.tambak_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">
                          {rec.kuantitas_pakan} kg
                        </p>
                        <p className="text-sm text-gray-500">per hari</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => exportPDF(rec)}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Simple Pagination */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition disabled:opacity-50"
                >
                  ← Prev
                </button>
                <span className="px-4 py-2 bg-white rounded-lg shadow">
                  Halaman {page}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={recommendations.length < 10}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
