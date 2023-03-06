import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full',
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatPageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'notification',
        loadChildren: () =>
          import('../notification/notification.module').then(
            (m) => m.NotificationPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
