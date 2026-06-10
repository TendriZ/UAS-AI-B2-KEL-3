'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className={styles.page}>
    <Navbar />

    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.icon}>
            🌊
          </div>

          <h1 className={styles.title}>
            Buat Akun Baru
          </h1>

          <p className={styles.subtitle}>
            Mulai kelola tambak udang dengan rekomendasi pakan berbasis AI.
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div>
            <label className={styles.label}>
              Username
            </label>

            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
              className={styles.input}
              placeholder="username"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className={styles.label}>
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
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className={styles.label}>
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
              placeholder="Nama lengkap (opsional)"
            />
          </div>

          <div>
            <label className={styles.label}>
              Password
            </label>

            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className={styles.input}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading
              ? 'Memproses...'
              : 'Buat Akun'}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun?

          <Link
            href="/login"
            className={styles.link}
          >
            Login Sekarang
          </Link>
        </p>
      </div>
    </main>
  </div>
);
}
