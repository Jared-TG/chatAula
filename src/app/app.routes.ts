import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { publicGuard } from './guards/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'chats',
        loadComponent: () =>
          import('./pages/chats/chats.component').then((m) => m.ChatsComponent),
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./pages/groups/groups.component').then((m) => m.GroupsComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: '',
        redirectTo: 'chats',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'chat-room/:id',
    loadComponent: () => import('./pages/chats/chat-room/chat-room.component').then(m => m.ChatRoomComponent),
    canActivate: [authGuard]
  },
  {
    path: 'group-info/:id',
    loadComponent: () => import('./pages/groups/group-info/group-info.component').then(m => m.GroupInfoComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
