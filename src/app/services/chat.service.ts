import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ChatServerService } from './chat-server.service';

@Injectable()
export class ChatService {
  constructor(private socket: ChatServerService) {}

  connect() {
    this.socket.connect();
  }
}
