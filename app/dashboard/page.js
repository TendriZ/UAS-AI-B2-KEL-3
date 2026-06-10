'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [tambaks, setTambaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Check auth
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const userData = await userRes.json();
      setUser(userData.data);

      // Fetch recommendations
      const recRes = await fetch('/api/recommendations?limit=5');
      const recData = await recRes.json();
      if (recData.success) {
        setRecommendations(recData.data);
      }

      // Fetch tambaks
      const tambakRes = await fetch('/api/tambak');
      const tambakData = await tambakRes.json();
      if (tambakData.success) {
        setTambaks(tambakData.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Selamat Datang, {user?.username}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola tambak dan lihat rekomendasi pakan udang Anda
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Link
              href="/"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🧮</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Hitung Pakan</h3>
                  <p className="text-sm text-gray-600">Buat rekomendasi</p>
                </div>
              </div>
            </Link>

            <Link
              href="/history"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">📋</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Riwayat</h3>
                  <p className="text-sm text-gray-600">Lihat rekomendasi</p>
                </div>
              </div>
            </Link>

            <Link
              href="/tambak"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">🦐</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Tambak Saya</h3>
                  <p className="text-sm text-gray-600">{tambaks.length} tambak</p>
                </div>
              </div>
            </Link>

            <Link
              href="/profile"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">👤</span>
                <div>
                  <h3 className="font-semibold text-gray-800">Profile</h3>
                  <p className="text-sm text-gray-600">Edit profile</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Rekomendasi Terbaru
              </h2>
              <Link
                href="/history"
                className="text-blue-600 hover:underline text-sm"
              >
                Lihat Semua →
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada rekomendasi.{' '}
                <Link href="/" className="text-blue-600 hover:underline">
                  Buat sekarang
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">
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
                        <p className="font-semibold text-gray-800 mt-1">
                          {rec.species_name || rec.jenis_udang || 'Unknown'} - {rec.usia_udang} hari
                        </p>
                        <p className="text-sm text-gray-600">
                          pH: {rec.ph_air} | Suhu: {rec.suhu_air}°C | {rec.cuaca}
                        </p>
                        {rec.tambak_name && (
                          <p className="text-xs text-gray-500 mt-1">
                            Tambak: {rec.tambak_name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {rec.kuantitas_pakan} kg
                        </p>
                        <p className="text-sm text-gray-500">per hari</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tambak List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Tambak
              </h2>
              <Link
                href="/tambak"
                className="text-blue-600 hover:underline text-sm"
              >
                Kelola →
              </Link>
            </div>

            {tambaks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Belum ada tambak.{' '}
                <Link href="/tambak" className="text-blue-600 hover:underline">
                  Tambahkan tambak
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tambaks.map((tambak) => (
                  <div
                    key={tambak.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <h3 className="font-semibold text-gray-800">{tambak.name}</h3>
                    {tambak.description && (
                      <p className="text-sm text-gray-600 mt-1">{tambak.description}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Volume: {tambak.volume_air} m³
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
