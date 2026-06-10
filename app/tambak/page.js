'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';

export default function TambakPage() {
  const router = useRouter();
  const [tambaks, setTambaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTambak, setEditingTambak] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    volume_air: ''
  });

  useEffect(() => {
    fetchTambaks();
  }, []);

  const fetchTambaks = async () => {
    try {
      const res = await fetch('/api/tambak');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTambaks(data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTambak
      ? `/api/tambak/${editingTambak.id}`
      : '/api/tambak';
    const method = editingTambak ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          volume_air: parseFloat(formData.volume_air)
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        setEditingTambak(null);
        setFormData({ name: '', description: '', volume_air: '' });
        fetchTambaks();
      } else {
        alert(data.message || 'Gagal menyimpan tambak');
      }
    } catch (error) {
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (tambak) => {
    setEditingTambak(tambak);
    setFormData({
      name: tambak.name,
      description: tambak.description || '',
      volume_air: tambak.volume_air.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus tambak ini?')) return;

    try {
      const res = await fetch(`/api/tambak/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTambaks(tambaks.filter((t) => t.id !== id));
      }
    } catch (error) {
      alert('Gagal menghapus tambak');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTambak(null);
    setFormData({ name: '', description: '', volume_air: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
  <div className={styles.page}>
    <Navbar />

    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Kelola Tambak</h1>
            <p className={styles.subtitle}>
              Kelola seluruh data tambak udang Anda dalam satu dashboard.
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={styles.addButton}
            >
              + Tambah Tambak
            </button>
          )}
        </div>

        {showForm && (
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingTambak
                ? "Edit Tambak"
                : "Tambah Tambak Baru"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.field}>
                <label className={styles.label}>
                  Nama Tambak *
                </label>

                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className={styles.input}
                  required
                  maxLength={100}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Deskripsi
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className={styles.textarea}
                  maxLength={500}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Volume Air (m³) *
                </label>

                <input
                  type="number"
                  step="0.1"
                  value={formData.volume_air}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      volume_air: e.target.value,
                    })
                  }
                  className={styles.input}
                  required
                  min="0.1"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  {editingTambak
                    ? "Update"
                    : "Simpan"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className={styles.cancelButton}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.grid}>
          {tambaks.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                🦐
              </div>

              <h3>Belum Ada Tambak</h3>

              <p>
                Tambahkan tambak pertama Anda untuk
                mulai melakukan monitoring kualitas
                air dan prediksi panen.
              </p>
            </div>
          ) : (
            tambaks.map((tambak) => (
              <div
                key={tambak.id}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.cardTitle}>
                      {tambak.name}
                    </h3>

                    <p className={styles.cardDate}>
                      Ditambahkan{" "}
                      {new Date(
                        tambak.created_at
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  <div className={styles.icon}>
                    🦐
                  </div>
                </div>

                {tambak.description && (
                  <p className={styles.description}>
                    {tambak.description}
                  </p>
                )}

                <div className={styles.cardBottom}>
                  <div className={styles.volume}>
                    Volume Air
                    <strong>
                      {" "}
                      {tambak.volume_air} m³
                    </strong>
                  </div>

                  <div className={styles.actions}>
                    <button
                      onClick={() =>
                        handleEdit(tambak)
                      }
                      className={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(tambak.id)
                      }
                      className={styles.deleteButton}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  </div>
);}
