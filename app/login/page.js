'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
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
        setError(data.message || 'Login gagal');
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
          <div className={styles.icon}>🦐</div>

          <h1 className={styles.title}>
            Selamat Datang
          </h1>

          <p className={styles.subtitle}>
            Masuk untuk mengelola tambak dan melihat rekomendasi pakan berbasis AI.
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
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading
              ? 'Memproses...'
              : 'Masuk ke Dashboard'}
          </button>
        </form>

        <p className={styles.footer}>
          Belum punya akun?

          <Link
            href="/register"
            className={styles.link}
          >
            Daftar Sekarang
          </Link>
        </p>
        
      </div>
    </main>
  </div>
);}
