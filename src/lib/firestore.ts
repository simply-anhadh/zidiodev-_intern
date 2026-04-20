import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastActive: string;
  totalUploads: number;
  storageUsed: number;
  status: 'active' | 'inactive' | 'banned';
}

export interface FirestoreUpload {
  id: string;
  userId: string;
  filename: string;
  uploadedAt: string;
  fileSize: number;
  rows: number;
  columns: string[];
  chartsGenerated: number;
  status: 'processing' | 'completed' | 'failed';
}

// ─── User helpers ─────────────────────────────────────────────────────────────

/**
 * Called on every sign-in. Creates the user doc if it doesn't exist,
 * updates lastActive, and returns the user's role.
 * The very first user to sign up automatically becomes admin.
 */
export async function syncUserToFirestore(clerkUser: {
  id: string;
  fullName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  createdAt: Date | null;
}): Promise<'user' | 'admin'> {
  const userRef = doc(db, 'users', clerkUser.id);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    // Update last active
    await updateDoc(userRef, { lastActive: new Date().toISOString() });
    return (snap.data() as FirestoreUser).role;
  }

  // New user — check if any users exist to decide role
  const usersCol = collection(db, 'users');
  const countSnap = await getCountFromServer(usersCol);
  const isFirst = countSnap.data().count === 0;

  const newUser: Omit<FirestoreUser, 'id'> = {
    name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    role: isFirst ? 'admin' : 'user',
    createdAt: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
    lastActive: new Date().toISOString(),
    totalUploads: 0,
    storageUsed: 0,
    status: 'active',
  };

  await setDoc(userRef, newUser);
  return newUser.role;
}

/** Fetch a single user's Firestore doc */
export async function getFirestoreUser(userId: string): Promise<FirestoreUser | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<FirestoreUser, 'id'>) };
}

/** Fetch all users (admin only) */
export async function getAllUsers(): Promise<FirestoreUser[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FirestoreUser, 'id'>) }));
}

/** Get total number of registered users */
export async function getUserCount(): Promise<number> {
  const snap = await getCountFromServer(collection(db, 'users'));
  return snap.data().count;
}

/** Get count of users who were active today */
export async function getDailyActiveCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snap = await getDocs(
    query(collection(db, 'users'), where('lastActive', '>=', today.toISOString()))
  );
  return snap.size;
}

/** Update user role (admin action) */
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { role });
}

/** Update user status (admin action) */
export async function updateUserStatus(
  userId: string,
  status: 'active' | 'inactive' | 'banned'
): Promise<void> {
  await updateDoc(doc(db, 'users', userId), { status });
}

/** Delete user doc (admin action) */
export async function deleteUserDoc(userId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId));
}

// ─── Upload helpers ───────────────────────────────────────────────────────────

/** Save a new upload record and update user stats */
export async function addUploadToFirestore(
  upload: Omit<FirestoreUpload, 'id'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'uploads'), {
    ...upload,
    createdAt: serverTimestamp(),
  });

  // Update user's totalUploads and storageUsed
  const userRef = doc(db, 'users', upload.userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const userData = userSnap.data() as FirestoreUser;
    await updateDoc(userRef, {
      totalUploads: (userData.totalUploads || 0) + 1,
      storageUsed: (userData.storageUsed || 0) + upload.fileSize,
    });
  }

  return docRef.id;
}

/** Fetch uploads for a specific user, newest first */
export async function getUserUploads(userId: string): Promise<FirestoreUpload[]> {
  const q = query(
    collection(db, 'uploads'),
    where('userId', '==', userId),
    orderBy('uploadedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FirestoreUpload, 'id'>) }));
}

/** Increment chartsGenerated on an upload doc */
export async function incrementChartsGenerated(uploadId: string): Promise<void> {
  const ref = doc(db, 'uploads', uploadId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = (snap.data() as FirestoreUpload).chartsGenerated || 0;
    await updateDoc(ref, { chartsGenerated: current + 1 });
  }
}

/** Get total uploads count across all users */
export async function getTotalUploadsCount(): Promise<number> {
  const snap = await getCountFromServer(collection(db, 'uploads'));
  return snap.data().count;
}
