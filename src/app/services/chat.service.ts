import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  collectionData, 
  serverTimestamp,
  query,
  orderBy
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
      created_by: {
        _id: user.uid,
        email: user.email || '',
        username: user.displayName || 'Estudiante'
      }
    };

    return await addDoc(groupsRef, groupData);
  }

  getGroups(): Observable<any[]> {
    const groupsRef = collection(this.firestore, 'groups');
    // Order by created_at descending (newest first)
    const q = query(groupsRef, orderBy('created_at', 'desc'));
    return collectionData(q, { idField: '_id' });
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
