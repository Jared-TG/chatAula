import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonFab, 
  IonFabButton, 
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonSearchbar,
  IonChip,
  IonAvatar,
  IonBadge
} from '@ionic/angular/standalone';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { User } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { 
  add, 
  chatbubblesOutline, 
  searchOutline, 
  clipboardOutline, 
  rocketOutline, 
  megaphoneOutline, 
  logOutOutline 
} from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonFab, 
    IonFabButton, 
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSearchbar,
    IonChip,
    IonAvatar,
    IonBadge
  ],
})
export class ChatsComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  allGroups: any[] = [];
  filteredGroups: any[] = [];
  availableTags: string[] = [];
  selectedTag: string = 'Todas';
  searchQuery: string = '';
  
  user: User | null = null;
  isGoogleUser = false;

  constructor() {
    addIcons({ 
      add, 
      chatbubblesOutline, 
      searchOutline, 
      clipboardOutline, 
      rocketOutline, 
      megaphoneOutline, 
      logOutOutline 
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUser;
    this.isGoogleUser = this.user?.providerData.some(p => p.providerId === 'google.com') ?? false;
    
    this.chatService.getGroups().subscribe(groups => {
      this.allGroups = groups;
      this.extractTags();
      this.filterGroups();
    });
  }

  extractTags() {
    const tagsSet = new Set<string>();
    this.allGroups.forEach(g => {
      if (g.tag) {
        tagsSet.add(g.tag);
      }
    });
    this.availableTags = Array.from(tagsSet).sort();
    
    // Si la etiqueta seleccionada ya no existe, volver a 'Todas'
    if (this.selectedTag !== 'Todas' && !this.availableTags.includes(this.selectedTag)) {
      this.selectedTag = 'Todas';
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.detail.value || '';
    this.filterGroups();
  }

  selectTag(tag: string) {
    this.selectedTag = tag;
    this.filterGroups();
  }

  filterGroups() {
    let temp = [...this.allGroups];

    if (this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      temp = temp.filter(g => g.name.toLowerCase().includes(q));
    }

    if (this.selectedTag !== 'Todas') {
      temp = temp.filter(g => g.tag === this.selectedTag);
    }

    this.filteredGroups = temp;
  }

  openCreateGroup() {
    // Navigate to the Groups tab which now acts as the Create Group view
    this.router.navigate(['/tabs/groups']);
  }

  openChatRoom(groupId: string) {
    this.router.navigate(['/chat-room', groupId]);
  }

  getCardBorderClass(index: number): string {
    const borders = ['border-blue', 'border-green', 'border-orange', 'border-red'];
    return borders[index % borders.length];
  }

  getCardIconClass(index: number): string {
    const bgClasses = ['bg-blue', 'bg-green', 'bg-orange', 'bg-red'];
    return bgClasses[index % bgClasses.length];
  }

  getCardIconName(index: number): string {
    const icons = ['chatbubbles-outline', 'clipboard-outline', 'rocket-outline', 'megaphone-outline'];
    return icons[index % icons.length];
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '';
    // If it's a Firestore timestamp, convert to Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Simple format just for UI mockup matching
    return new Intl.DateTimeFormat('es-MX', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  }
  
  getUnreadCount(group: any): number {
    if (!this.user || !group.unreadCount) return 0;
    return group.unreadCount[this.user.uid] || 0;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
