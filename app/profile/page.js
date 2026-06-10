'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import styles from './page.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setFormData({
          full_name: data.data.full_name || '',
          email: data.data.email
        });
      }
    } catch (error) {
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setEditing(false);
        setMessage('Profile berhasil diperbarui!');
      } else {
        setMessage(data.message || 'Gagal update profile');
      }
    } catch (error) {
      setMessage('Terjadi kesalahan');
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
  <div className={styles.page}>
    <Navbar />

    <main className={styles.container}>
      <div className={styles.profileWrapper}>
        <div className={styles.profileHero}>
          <div className={styles.avatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className={styles.title}>
              Profile Saya
            </h1>

            <p className={styles.subtitle}>
              Kelola informasi akun TambakAI Anda
            </p>
          </div>
        </div>

        {message && (
          <div
            className={
              message.includes("berhasil")
                ? styles.successAlert
                : styles.errorAlert
            }
          >
            {message}
          </div>
        )}

        <div className={styles.card}>
          {!editing ? (
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span>Username</span>
                <strong>{user?.username}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>

              <div className={styles.infoItem}>
                <span>Nama Lengkap</span>
                <strong>
                  {user?.full_name || "-"}
                </strong>
              </div>

              <div className={styles.infoItem}>
                <span>Terdaftar Sejak</span>
                <strong>
                  {new Date(
                    user?.created_at
                  ).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </div>

              <button
                onClick={() => setEditing(true)}
                className={styles.primaryButton}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleUpdate}
              className={styles.form}
            >
              <div className={styles.field}>
                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={user?.username}
                  disabled
                  className={styles.disabledInput}
                />
              </div>

              <div className={styles.field}>
                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>
                  Nama Lengkap
                </label>

                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      full_name: e.target.value,
                    })
                  }
                  className={styles.input}
                  maxLength={100}
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  Simpan
                </button>

                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setEditing(false);

                    setFormData({
                      full_name:
                        user?.full_name || "",
                      email: user?.email,
                    });
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  </div>
);}
