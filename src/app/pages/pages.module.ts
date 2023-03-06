import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [PagesRoutingModule, SocketIoModule],
})
export class PagesModule {}
