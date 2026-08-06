import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  authState,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable for auth state
  public currentUser$: Observable<User | null> = authState(this.auth);

  constructor() {}

  // Current user sync
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  // 1. Email Login
  async loginWithEmail(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // 2. Email Registration + Firestore Profile
  async registerWithEmail(email: string, password: string, displayName: string) {
    // A. Create user in Auth
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;

    // B. Update profile in Auth
    await updateProfile(user, { displayName });

    // C. Create user document in Firestore
    await this.createUserDocument(user.uid, {
      email: user.email,
      username: displayName,
      createdAt: serverTimestamp(),
      provider: 'password'
    });

    return userCredential;
  }

  // 3. Google Sign-In + Firestore Profile (if new)
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(this.auth, provider);
    const user = userCredential.user;

    // Check if user document already exists
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // First time Google login, create profile
      await this.createUserDocument(user.uid, {
        email: user.email,
        username: user.displayName || 'Google User',
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        provider: 'google'
      });
    }

    return userCredential;
  }

  // 4. Logout
  async logout() {
    return await signOut(this.auth);
  }

  // Helper function to create Firestore document
  private async createUserDocument(uid: string, data: any) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return await setDoc(userDocRef, data, { merge: true });
  }

  async updateUserRole(uid: string, role: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return await updateDoc(userDocRef, { role });
  }
  // Fetch all registered users
  getAllUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' });
  }
}
