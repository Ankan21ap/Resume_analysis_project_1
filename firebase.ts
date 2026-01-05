
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, DocumentData } from 'firebase/firestore';

// Note: In a production environment, these should come from your Firebase Console.
// For this demo, we assume the Firebase project is configured.
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if config is provided, otherwise export mocks for UI development
let app, auth, db;

try {
  // We check if "YOUR_FIREBASE_API_KEY" has been replaced
  if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (e) {
  console.error("Firebase Initialization Error", e);
}

export const loginAnonymously = async (): Promise<User | null> => {
  if (!auth) return null;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

export const saveAnalysis = async (uid: string, analysis: any) => {
  if (!db) return;
  try {
    const docRef = await addDoc(collection(db, "analyses"), {
      ...analysis,
      uid,
      createdAt: Date.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Firestore Error:", error);
  }
};

export const getHistory = async (uid: string) => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "analyses"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error("Firestore History Error:", error);
    return [];
  }
};

export { auth, db };
