import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
type PathMatch = 'full' | 'prefix' | undefined;
const routes = [
  {
    path: '',
    redirectTo: 'chat-gpt',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'chat-gpt',
    loadChildren: () =>
      import('./chat-gpt/chat-gpt.module').then((m) => m.ChatGptPageModule),
  },
  {
    path: 'verify-email-address',
    loadChildren: () =>
      import('./verify-email-address/verify-email-address.module').then(
        (m) => m.VerifyEmailAddressPageModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PagesRoutingModule {}
