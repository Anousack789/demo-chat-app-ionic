import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from 'src/app/config';
import { IChatMessage } from './i-chat-gpt';

@Injectable()
export class ChatGptApiService {
  constructor(private http: HttpClient) {}
  private baseUrl = Config.apiUrl + 'chatgpt';

  private listMessage: IChatMessage[] = [];

  sendMessage(uuid: string, message: string) {
    if (message.length > 0) {
      const messageDto: IChatMessage = {
        role: 'user',
        content: message,
      };
      this.listMessage.push(messageDto);
    }
    return this.http.post<{ message: string; finishReason: string }>(
      this.baseUrl + '/send-message',
      {
        uuid,
        message: JSON.stringify(this.listMessage),
      }
    );
  }

  clearMessage() {
    this.listMessage = [];
  }

  addGptMessage(message: string) {
    const messageDto: IChatMessage = {
      role: 'assistant',
      content: message,
    };
    this.listMessage.push(messageDto);
  }
}
