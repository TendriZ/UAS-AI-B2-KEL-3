'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import jsPDF from 'jspdf';
import styles from './page.module.css';

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
  <div className={styles.page}>
    <Navbar />

    <main className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Riwayat Rekomendasi
          </h1>

          <p className={styles.subtitle}>
            Seluruh rekomendasi pakan yang pernah
            dibuat oleh sistem TambakAI.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className={styles.newButton}
        >
          + Buat Baru
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingCard}>
          <div className={styles.loader}></div>
          <p>Memuat data...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>
            📄
          </div>

          <h3>
            Belum Ada Riwayat
          </h3>

          <p>
            Mulai lakukan perhitungan pakan
            untuk mendapatkan rekomendasi pertama.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.timeline}>
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={styles.card}
              >
                <div className={styles.cardHeader}>
                  <div>
                    <span className={styles.date}>
                      {new Date(
                        rec.created_at
                      ).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>

                    <h3 className={styles.species}>
                      {rec.species_name ||
                        rec.jenis_udang ||
                        "Unknown"}
                      {" • "}
                      {rec.usia_udang} hari
                    </h3>
                  </div>

                  <div className={styles.feedBox}>
                    <span>
                      Pakan Harian
                    </span>

                    <strong>
                      {rec.kuantitas_pakan}
                      kg
                    </strong>
                  </div>
                </div>

                <div className={styles.stats}>
                  <div>
                    <span>pH</span>
                    <strong>
                      {rec.ph_air}
                    </strong>
                  </div>

                  <div>
                    <span>Suhu</span>
                    <strong>
                      {rec.suhu_air}°C
                    </strong>
                  </div>

                  <div>
                    <span>Cuaca</span>
                    <strong>
                      {rec.cuaca}
                    </strong>
                  </div>

                  <div>
                    <span>Volume</span>
                    <strong>
                      {rec.volume_air}
                      m³
                    </strong>
                  </div>

                  <div>
                    <span>Udang</span>
                    <strong>
                      {rec.jumlah_udang}
                    </strong>
                  </div>
                </div>

                {rec.tambak_name && (
                  <div className={styles.tambak}>
                    🦐 {rec.tambak_name}
                  </div>
                )}

                <div className={styles.actions}>
                  <button
                    onClick={() =>
                      exportPDF(rec)
                    }
                    className={styles.exportButton}
                  >
                    Export PDF
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(rec.id)
                    }
                    className={styles.deleteButton}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              onClick={() =>
                setPage(
                  Math.max(
                    1,
                    page - 1
                  )
                )
              }
              disabled={page === 1}
              className={styles.pageButton}
            >
              ← Prev
            </button>

            <div className={styles.pageInfo}>
              Halaman {page}
            </div>

            <button
              onClick={() =>
                setPage(page + 1)
              }
              disabled={
                recommendations.length < 10
              }
              className={styles.pageButton}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </main>
  </div>
);}
