import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io';
import { ChatService } from '../services/chat.service';
import { SocketServer } from '../services/socket-server.service';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [PagesRoutingModule, SocketIoModule],
  providers: [ChatService, SocketServer],
})
export class PagesModule {}
