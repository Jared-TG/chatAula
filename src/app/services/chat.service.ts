import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  collectionData, 
  serverTimestamp,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  arrayUnion
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  constructor() {}

  // --- GROUPS (SALAS) ---

  async createGroup(name: string, description: string) {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not authenticated');

    const groupsRef = collection(this.firestore, 'groups');
    
    // According to our plan, we store the UserDTO format in created_by
    const groupData = {
      name,
      description,
      created_at: serverTimestamp(),
      memberIds: [user.uid],
      created_by: {
        _id: user.uid,
        email: user.email || '',
        username: user.displayName || 'Estudiante'
      }
    };

    return await addDoc(groupsRef, groupData);
  }

  getGroups(): Observable<any[]> {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not authenticated');

    const groupsRef = collection(this.firestore, 'groups');
    // Filtrar por grupos donde el usuario está en memberIds
    const q = query(
      groupsRef, 
      where('memberIds', 'array-contains', user.uid),
      orderBy('created_at', 'desc')
    );
    return collectionData(q, { idField: '_id' });
  }

  async inviteUser(groupId: string, newUserId: string) {
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    return await updateDoc(groupDocRef, {
      memberIds: arrayUnion(newUserId)
    });
  }

  // --- MESSAGES ---

  async sendMessage(groupId: string, text: string) {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not authenticated');

    const messagesRef = collection(this.firestore, `groups/${groupId}/messages`);
    
    // sent_by excludes email as per DTO
    const messageData = {
      description: text,
      sent_at: serverTimestamp(),
      sent_by: {
        _id: user.uid,
        username: user.displayName || 'Estudiante'
      }
    };

    return await addDoc(messagesRef, messageData);
  }

  getMessages(groupId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, `groups/${groupId}/messages`);
    // Order by sent_at ascending (oldest first for chat view)
    const q = query(messagesRef, orderBy('sent_at', 'asc'));
    return collectionData(q, { idField: '_id' });
  }
}
