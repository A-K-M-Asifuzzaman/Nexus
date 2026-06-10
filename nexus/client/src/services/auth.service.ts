import {
  auth,
  googleProvider,
  githubProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  type FirebaseUser,
} from '@/lib/firebase'
import { api } from './api'
import type { User } from '@/types'

/** Convert a Firebase user into a Nexus User by syncing with the backend. */
async function syncUserWithBackend(fbUser: FirebaseUser): Promise<{ user: User; token: string }> {
  const idToken = await fbUser.getIdToken()
  const { data } = await api.post('/auth/firebase-sync', { idToken })
  return { user: data.data.user as User, token: idToken }
}

export const authService = {
  /** Email + password login via Firebase */
  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return syncUserWithBackend(cred.user)
  },

  /** Email + password registration via Firebase */
  async register(name: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await sendEmailVerification(cred.user)
    return syncUserWithBackend(cred.user)
  },

  /** Google OAuth via Firebase popup */
  async loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    return syncUserWithBackend(cred.user)
  },

  /** GitHub OAuth via Firebase popup */
  async loginWithGithub() {
    const cred = await signInWithPopup(auth, githubProvider)
    return syncUserWithBackend(cred.user)
  },

  /** Send Firebase password-reset email */
  async forgotPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  },

  /** Sign out from Firebase */
  async logout() {
    await signOut(auth)
  },

  /** Get fresh ID token (used for API calls) */
  async getIdToken(): Promise<string | null> {
    return auth.currentUser?.getIdToken() ?? null
  },

  /** Expose the underlying Firebase auth instance for onAuthStateChanged listeners */
  auth,
}
