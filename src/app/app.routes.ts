import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
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
        path: 'study',
        loadComponent: () =>
          import('./pages/study/study.component').then((m) => m.StudyComponent),
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
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];
