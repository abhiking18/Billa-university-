/**
 * =========================================================================
 * BILLA UNIVERSITY — FIREBASE CONFIGURATION
 * =========================================================================
 * PASTE YOUR FIREBASE WEB APP CONFIGURATION CREDENTIALS BELOW.
 * 
 * Where to find these in Firebase Console:
 * 1. Open https://console.firebase.google.com/
 * 2. Select or create your Firebase Project (e.g. "Billa University").
 * 3. Go to Project Settings (gear icon at top left) -> General.
 * 4. Scroll down to "Your apps" section and click the Web (</>) icon.
 * 5. Register the app and copy the `firebaseConfig` object values.
 * 6. Replace the placeholder values in FIREBASE_CONFIG below.
 * =========================================================================
 */
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDummyKey-ReplaceWithYourOwnFirebaseApiKey",
  authDomain: "billa-university.firebaseapp.com",
  projectId: "billa-university",
  storageBucket: "billa-university.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};

/**
 * =========================================================================
 * ADMIN PIN FOR MEME DELETION
 * =========================================================================
 * If empty (""), anyone can delete uploaded memes.
 * If set to a PIN (e.g. "1234"), the in-page confirmation panel prompts
 * for this PIN before deleting any meme.
 * =========================================================================
 */
export const ADMIN_PIN: string = "";

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { MemeItem } from '../data/config';

// ---------------------------------------------------------------------------
// Firebase App & Firestore Initialization
// ---------------------------------------------------------------------------
let db: Firestore | null = null;
let isFirebaseConfigured = false;

try {
  // Check if real config is provided (not dummy placeholder)
  const isDummy =
    !FIREBASE_CONFIG.apiKey ||
    FIREBASE_CONFIG.apiKey.includes('DummyKey') ||
    FIREBASE_CONFIG.projectId === 'billa-university';

  const app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
  db = getFirestore(app);
  // Mark configured only if real key looks supplied or user initialized it
  isFirebaseConfigured = !isDummy;
} catch (err) {
  console.warn('Firebase initialization notice:', err);
  db = null;
  isFirebaseConfigured = false;
}

export { db, isFirebaseConfigured };

// ---------------------------------------------------------------------------
// 1. Client-Side Image Compression using Canvas
// Max Width: 1000px | Quality: 0.7 JPEG | File max: 10MB | Output max: 700KB
// ---------------------------------------------------------------------------
export async function compressImage(file: File): Promise<string> {
  // Reject files over 10MB before compression
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum allowed file size before compression is 10MB.');
  }

  // Accept only images (jpg, png, webp, gif)
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid image format. Supported formats: JPG, PNG, WEBP, GIF.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file. Check your device storage and try again.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Unable to decode image file. Please try another image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxWidth = 1000;

        // Downscale proportionally if width exceeds 1000px
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas compression context unavailable.'));
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Quality 0.7 JPEG compression
        let quality = 0.7;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // Calculate binary size in bytes: base64 string length * 3/4
        const getByteSize = (base64String: string) => {
          const raw = base64String.split(',')[1] || '';
          return Math.round((raw.length * 3) / 4);
        };

        const maxAllowedBytes = 700 * 1024; // 700KB limit
        let currentSize = getByteSize(dataUrl);

        // If still above 700KB, perform secondary compression pass
        if (currentSize > maxAllowedBytes) {
          quality = 0.5;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          currentSize = getByteSize(dataUrl);
        }

        // Final verification under 700KB
        if (currentSize > maxAllowedBytes) {
          return reject(
            new Error(`Compressed image (${Math.round(currentSize / 1024)}KB) exceeds 700KB limit. Please choose a smaller resolution photo.`)
          );
        }

        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------------
// 2. Real-Time Memes Listener (Firestore onSnapshot + Local Offline Mirror)
// ---------------------------------------------------------------------------
const LOCAL_STORAGE_KEY = 'billa_firestore_memes_cache';

export function getLocalCachedMemes(): MemeItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // fallback
  }
  return [];
}

export function saveLocalCachedMemes(memes: MemeItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memes));
  } catch {
    // fallback
  }
}

export function subscribeToMemes(
  onUpdate: (memes: MemeItem[]) => void,
  onError: (errorMessage: string) => void
): () => void {
  // If Firestore is available, attach real-time onSnapshot listener
  if (db) {
    try {
      const memesCol = collection(db, 'memes');
      const q = query(memesCol, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedMemes: MemeItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              firestoreId: docSnap.id,
              src: data.image || '',
              caption: data.caption || '',
              category: data.category || 'Classroom',
              likes: typeof data.likes === 'number' ? Math.max(0, data.likes) : 0,
              isUploaded: true,
              createdAt: data.createdAt,
            };
          });

          // Mirror into local cache for instantaneous offline load
          saveLocalCachedMemes(fetchedMemes);
          onUpdate(fetchedMemes);
        },
        (error) => {
          console.warn('Firestore onSnapshot notice:', error);
          // If offline or permission notice, fallback to local cache
          const cached = getLocalCachedMemes();
          onUpdate(cached);
          if (error.code === 'permission-denied') {
            onError('Permission denied. Please check your Firestore security rules.');
          } else if (error.code === 'unavailable') {
            onError('Database temporarily unavailable. Using device cache.');
          }
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.warn('Failed to attach Firestore listener:', err);
    }
  }

  // Fallback: sync via storage events across tabs & return cached
  const updateFromCache = () => {
    onUpdate(getLocalCachedMemes());
  };
  updateFromCache();

  window.addEventListener('storage', updateFromCache);
  return () => window.removeEventListener('storage', updateFromCache);
}

// ---------------------------------------------------------------------------
// 3. Upload Meme to Firestore
// ---------------------------------------------------------------------------
export async function uploadMemeToFirestore(data: {
  image: string;
  caption: string;
  category: 'Classroom' | 'Exams' | 'Hostel' | 'Friends';
}): Promise<string> {
  // Client validation
  if (!data.image || !data.image.startsWith('data:image/')) {
    throw new Error('Valid image is required.');
  }
  if (data.caption.length > 120) {
    throw new Error('Caption must be under 120 characters.');
  }

  // Calculate base64 size
  const rawBase64 = data.image.split(',')[1] || '';
  const byteSize = Math.round((rawBase64.length * 3) / 4);
  if (byteSize > 700 * 1024) {
    throw new Error('Image size must be strictly under 700KB.');
  }

  const newDocData = {
    image: data.image,
    caption: data.caption.trim(),
    category: data.category,
    likes: 0,
    createdAt: serverTimestamp(),
  };

  if (db) {
    try {
      const memesCol = collection(db, 'memes');
      const docRef = await addDoc(memesCol, newDocData);
      return docRef.id;
    } catch (err: any) {
      console.error('Firestore upload error:', err);
      // If error, check message and offer clear explanation
      const msg = err.message || '';
      if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
        throw new Error('Upload failed: Firestore security rules rejected write. Verify rules are published.');
      } else if (msg.includes('offline') || msg.includes('unavailable')) {
        throw new Error('Upload failed. Check your internet connection and try again.');
      }
      throw new Error(`Upload failed: ${msg || 'Check your internet and try again.'}`);
    }
  }

  // Local device mirror fallback (for instant preview before Firebase keys are set)
  const localId = `local-${Date.now()}`;
  const localItem: MemeItem = {
    id: localId,
    firestoreId: localId,
    src: data.image,
    caption: data.caption.trim(),
    category: data.category,
    likes: 0,
    isUploaded: true,
    createdAt: new Date().toISOString(),
  };
  const cached = getLocalCachedMemes();
  saveLocalCachedMemes([localItem, ...cached]);
  window.dispatchEvent(new Event('storage'));
  return localId;
}

// ---------------------------------------------------------------------------
// 4. Delete Meme from Firestore
// ---------------------------------------------------------------------------
export async function deleteMemeFromFirestore(id: string): Promise<void> {
  if (db && !id.startsWith('local-')) {
    try {
      const docRef = doc(db, 'memes', id);
      await deleteDoc(docRef);
    } catch (err: any) {
      console.error('Firestore delete error:', err);
      throw new Error(`Delete failed: ${err.message || 'Check your connection and try again.'}`);
    }
  }

  // Also remove from local mirror cache
  const cached = getLocalCachedMemes().filter((m) => m.id !== id && m.firestoreId !== id);
  saveLocalCachedMemes(cached);
  window.dispatchEvent(new Event('storage'));
}

// ---------------------------------------------------------------------------
// 5. Toggle Real Likes in Firestore (increment(1) / increment(-1))
// ---------------------------------------------------------------------------
const LIKED_MEMES_DEVICE_KEY = 'billa_user_liked_memes';

export function getDeviceLikedMemes(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_MEMES_DEVICE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // fallback
  }
  return new Set();
}

export function setDeviceLikedMeme(id: string | number, liked: boolean): void {
  try {
    const current = getDeviceLikedMemes();
    const strId = String(id);
    if (liked) {
      current.add(strId);
    } else {
      current.delete(strId);
    }
    localStorage.setItem(LIKED_MEMES_DEVICE_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // fallback
  }
}

export async function toggleMemeLikeInFirestore(
  memeId: string | number,
  isCurrentlyLiked: boolean
): Promise<void> {
  const nextLiked = !isCurrentlyLiked;
  setDeviceLikedMeme(memeId, nextLiked);

  const strId = String(memeId);
  const delta = nextLiked ? 1 : -1;

  if (db && !strId.startsWith('local-') && !strId.match(/^\d+$/)) {
    try {
      const docRef = doc(db, 'memes', strId);
      await updateDoc(docRef, {
        likes: increment(delta),
      });
      return;
    } catch (err) {
      console.warn('Firestore like increment notice:', err);
    }
  }

  // Local cache update for starter memes or local specimens
  const cached = getLocalCachedMemes().map((m) => {
    if (m.id === memeId || m.firestoreId === memeId) {
      return { ...m, likes: Math.max(0, m.likes + delta) };
    }
    return m;
  });
  saveLocalCachedMemes(cached);
  window.dispatchEvent(new Event('storage'));
}
