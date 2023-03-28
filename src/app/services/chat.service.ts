import { Injectable } from '@angular/core';
import { SocketServer } from './socket-server.service';

@Injectable()
export class ChatService {
  constructor(private socket: SocketServer) {}

  getUserCount() {
    return this.socket.fromEvent('user-count');
  }

  getMessages() {
    return this.socket.fromEvent('list-message');
  }

  getClientId() {
    return this.socket.fromEvent('client-id');
  }

  getChatMessage() {
    return this.socket.fromEvent('chat-message');
  }

  sendMessage(id: string, message: string) {
    const data = {
      id,
      message,
      timestamp: new Date().getTime(),
    };
    this.socket.emit('send-message', data);
  }

  clearMessage(uuid: string) {
    this.socket.emit('clear-message', uuid);
  }

  getChatGptStreamMessage(uuid: string) {
    return this.socket.fromEvent(uuid);
  }
}
