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
  getDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove
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

  async createGroup(name: string, description: string, tag: string = 'Académicas') {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not authenticated');

    const groupsRef = collection(this.firestore, 'groups');
    
    // According to our plan, we store the UserDTO format in created_by
    const groupData = {
      name,
      description,
      tag,
      created_at: serverTimestamp(),
      memberIds: [user.uid],
      unreadCount: {
        [user.uid]: 0
      },
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
      memberIds: arrayUnion(newUserId),
      [`unreadCount.${newUserId}`]: 0
    });
  }

  // --- MESSAGES ---

  async sendMessage(groupId: string, text: string) {
    const user = this.authService.currentUser;
    if (!user) throw new Error('User not authenticated');

    const messagesRef = collection(this.firestore, `groups/${groupId}/messages`);
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    const groupSnap = await getDoc(groupDocRef);
    
    const messageData = {
      description: text,
      sent_at: serverTimestamp(),
      sent_by: {
        _id: user.uid,
        username: user.displayName || 'Estudiante'
      }
    };

    const docRef = await addDoc(messagesRef, messageData);

    if (groupSnap.exists()) {
      const groupInfo = groupSnap.data();
      const members = groupInfo['memberIds'] || [];
      const unreadCountUpdates: any = {};
      
      members.forEach((mId: string) => {
        if (mId !== user.uid) {
           const currentCount = (groupInfo['unreadCount'] && groupInfo['unreadCount'][mId]) ? groupInfo['unreadCount'][mId] : 0;
           unreadCountUpdates[`unreadCount.${mId}`] = currentCount + 1;
        }
      });
      
      await updateDoc(groupDocRef, {
        lastMessage: {
          description: text,
          sent_at: serverTimestamp(),
          sent_by: user.displayName || 'Estudiante'
        },
        ...unreadCountUpdates
      });
    }
    
    return docRef;
  }

  getMessages(groupId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, `groups/${groupId}/messages`);
    // Order by sent_at ascending (oldest first for chat view)
    const q = query(messagesRef, orderBy('sent_at', 'asc'));
    return collectionData(q, { idField: '_id' });
  }

  async deleteMessage(groupId: string, messageId: string) {
    const messageRef = doc(this.firestore, `groups/${groupId}/messages/${messageId}`);
    return await deleteDoc(messageRef);
  }

  async editMessage(groupId: string, messageId: string, newText: string) {
    const messageRef = doc(this.firestore, `groups/${groupId}/messages/${messageId}`);
    return await updateDoc(messageRef, {
      description: newText,
      edited: true // Opcional, para mostrar "Editado" en UI
    });
  }

  async kickUser(groupId: string, userId: string) {
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    return await updateDoc(groupDocRef, {
      memberIds: arrayRemove(userId)
    });
  }
  
  async resetUnreadCount(groupId: string, userId: string) {
    const groupDocRef = doc(this.firestore, `groups/${groupId}`);
    await updateDoc(groupDocRef, {
      [`unreadCount.${userId}`]: 0
    });
  }
}
