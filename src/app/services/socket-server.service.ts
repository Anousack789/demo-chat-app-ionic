import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Config } from '../config';
import { AuthService } from './auth.service';
@Injectable()
export class SocketServer extends Socket {
  constructor(authService: AuthService) {
    super({
      url: Config.socketUrl,
      options: {
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionAttempts: 5,
        auth: {
          token: authService.idToken,
        },
      },
    });
  }
}
