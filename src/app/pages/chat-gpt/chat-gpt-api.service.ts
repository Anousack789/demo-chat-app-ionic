import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from 'src/app/config';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from 'openai';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ChatGptApiService {
  constructor(private http: HttpClient) {}
  private baseUrl = Config.apiUrl + 'chatgpt';

  private listMessage: ChatCompletionRequestMessage[] = [];

  sendMessage(uuid: string, message: string) {
    if (message.length > 0) {
      const messageDto: ChatCompletionRequestMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
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
    const messageDto: ChatCompletionRequestMessage = {
      role: ChatCompletionRequestMessageRoleEnum.Assistant,
      content: message,
    };
    this.listMessage.push(messageDto);
  }
}
