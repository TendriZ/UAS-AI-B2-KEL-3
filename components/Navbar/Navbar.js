'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');

      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.brand}>
            <div className={styles.logo}>
              🦐
            </div>

            <div>
              <h1 className={styles.title}>
                TambakAI
              </h1>

              <p className={styles.subtitle}>
                Smart Shrimp Feeding System
              </p>
            </div>
          </Link>

          <div className={styles.menu}>
            <Link href="/" className={styles.link}>
              Beranda
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className={styles.link}>
                  Dashboard
                </Link>

                <Link href="/tambak" className={styles.link}>
                  Tambak
                </Link>

                <Link href="/history" className={styles.link}>
                  Riwayat
                </Link>

                <div className={styles.divider}></div>

                <Link
                  href="/profile"
                  className={styles.profile}
                >
                  Hi, {user.username}
                </Link>

                <button
                  onClick={handleLogout}
                  className={styles.primaryButton}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={styles.secondaryButton}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className={styles.primaryButton}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}