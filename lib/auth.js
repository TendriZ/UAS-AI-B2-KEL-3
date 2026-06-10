/**
 * Authentication and Session Management
 * Uses iron-session for secure session handling
 */

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// Session configuration
const sessionOptions = {
  password: process.env.SESSION_SECRET || 'default_secret_change_in_production_minimum_32_characters_long',
  cookieName: 'tambakai_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  }
};

/**
 * Get session from cookies
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession(cookieStore, sessionOptions);
  return session;
}

/**
 * Check if user is authenticated
 */
export async function getAuthUser() {
  const session = await getSession();
  if (!session || !session.userId) {
    return null;
  }
  return {
    userId: session.userId,
    email: session.email,
    username: session.username,
    role: session.role || 'USER'
  };
}

/**
 * Set session data
 */
export async function setSession(user) {
  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  session.username = user.username;
  session.role = user.role || 'USER';
  await session.save();
}

/**
 * Clear session (logout)
 */
export async function clearSession() {
  const session = await getSession();
  session.destroy();
}

/**
 * Require authentication - returns user or throws error
 */
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export { sessionOptions };
