import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Config } from '../config';
@Injectable()
export class ChatServerService extends Socket {
  constructor() {
    super({
      url: Config.socketUrl,
      options: {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 5,
        auth: {
          token: 'Hello world 123',
        },
      },
    });
  }
}
