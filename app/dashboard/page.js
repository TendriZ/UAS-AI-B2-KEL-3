'use client';


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

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
      <div className={styles.page}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
  <div className={styles.page}>
    <Navbar />

    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <span className={styles.badge}>
              TambakAI Dashboard
            </span>

            <h1 className={styles.heroTitle}>
              Selamat Datang, {user?.username}
            </h1>

            <p className={styles.heroSubtitle}>
              Kelola tambak, pantau rekomendasi pakan, dan optimalkan produksi udang Anda.
            </p>
          </div>
        </section>

        <section className={styles.actionsGrid}>
          <Link href="/" className={styles.actionCard}>
            <div className={styles.actionIcon}>🧮</div>
            <h3>Hitung Pakan</h3>
            <p>Buat rekomendasi baru</p>
          </Link>

          <Link href="/history" className={styles.actionCard}>
            <div className={styles.actionIcon}>📋</div>
            <h3>Riwayat</h3>
            <p>Lihat perhitungan</p>
          </Link>

          <Link href="/tambak" className={styles.actionCard}>
            <div className={styles.actionIcon}>🦐</div>
            <h3>Tambak Saya</h3>
            <p>{tambaks.length} tambak aktif</p>
          </Link>

          <Link href="/profile" className={styles.actionCard}>
            <div className={styles.actionIcon}>👤</div>
            <h3>Profil</h3>
            <p>Kelola akun</p>
          </Link>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Rekomendasi Terbaru</h2>

            <Link href="/history">
              Lihat Semua →
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Belum ada rekomendasi.</p>

              <Link href="/">
                Buat rekomendasi pertama
              </Link>
            </div>
          ) : (
            <div className={styles.recommendationList}>
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={styles.recommendationCard}
                >
                  <div>
                    <p className={styles.date}>
                      {new Date(rec.created_at).toLocaleDateString('id-ID')}
                    </p>

                    <h4>
                      {rec.species_name ||
                        rec.jenis_udang ||
                        'Unknown'}
                    </h4>

                    <p>
                      pH {rec.ph_air} •
                      Suhu {rec.suhu_air}°C •
                      {rec.cuaca}
                    </p>
                  </div>

                  <div className={styles.feedAmount}>
                    <strong>
                      {rec.kuantitas_pakan} kg
                    </strong>

                    <span>per hari</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Daftar Tambak</h2>

            <Link href="/tambak">
              Kelola →
            </Link>
          </div>

          {tambaks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Belum ada tambak.</p>

              <Link href="/tambak">
                Tambahkan tambak
              </Link>
            </div>
          ) : (
            <div className={styles.tambakGrid}>
              {tambaks.map((tambak) => (
                <div
                  key={tambak.id}
                  className={styles.tambakCard}
                >
                  <h3>{tambak.name}</h3>

                  {tambak.description && (
                    <p>{tambak.description}</p>
                  )}

                  <span>
                    Volume Air:
                    {' '}
                    {tambak.volume_air}
                    m³
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  </div>
);
}
