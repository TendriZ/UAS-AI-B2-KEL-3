'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setMobileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <Link href="/" className={styles.brand} onClick={closeMobileMenu}>
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

            {/* Desktop Menu */}
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

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuButton}
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className={styles.hamburger}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.open : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu Panel */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.open : ''}`}>
        <button
          className={styles.closeButton}
          onClick={closeMobileMenu}
          aria-label="Close menu"
        >
          <span></span>
          <span></span>
        </button>

        <div className={styles.mobileMenuBrand}>
          <div className={styles.logo} style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
            🦐
          </div>
          <div>
            <h1 className={styles.title}>TambakAI</h1>
          </div>
        </div>

        <div className={styles.mobileMenuLinks}>
          <Link href="/" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
            <span className={styles.mobileMenuLinkIcon}>🏠</span>
            Beranda
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>📊</span>
                Dashboard
              </Link>

              <Link href="/tambak" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>🏝️</span>
                Tambak
              </Link>

              <Link href="/history" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>📜</span>
                Riwayat
              </Link>

              <Link href="/profile" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>👤</span>
                Profil: {user.username}
              </Link>

              <div className={styles.mobileMenuDivider}></div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>🔐</span>
                Login
              </Link>

              <Link href="/register" className={styles.mobileMenuLink} onClick={closeMobileMenu}>
                <span className={styles.mobileMenuLinkIcon}>✏️</span>
                Register
              </Link>
            </>
          )}
        </div>

        {user && (
          <div className={styles.mobileMenuActions}>
            <button
              onClick={handleLogout}
              className={styles.primaryButton}
              style={{ width: '100%', textAlign: 'center' }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
