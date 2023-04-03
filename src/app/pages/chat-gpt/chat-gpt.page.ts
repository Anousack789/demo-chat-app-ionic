import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { generateUuid } from 'src/app/helper/tools';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto } from '../chat/dto/message.dto';
import { ChatGptApiService } from './chat-gpt-api.service';
import { howToImpletementInstallPWA } from './dummy-data';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.page.html',
  styleUrls: ['./chat-gpt.page.scss'],
})
export class ChatGptPage implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private chatApi: ChatGptApiService,
    public auth: AuthService,
    private router: Router
  ) {}

  message = '';
  private streamInput = new Subject<string>();
  private streamMessage = new BehaviorSubject<string>('');
  private listMessage = new BehaviorSubject<MessageDto[]>([
    {
      id: '1',
      role: 'assistant',
      message: 'Hello, I am GPT-3. How can I help you?',
      senderId: '1',
      timestamp: new Date().getTime(),
    },
    {
      id: '2',
      role: 'assistant',
      message: howToImpletementInstallPWA,
      senderId: '2',
      timestamp: new Date().getTime(),
    },
  ]);
  listMessage$ = this.listMessage.asObservable();
  streamMessage$ = this.streamMessage.asObservable();
  @ViewChild(IonContent, { read: IonContent, static: false }) ionContent:
    | IonContent
    | undefined;

  onResponding = false;
  private uuid = '';

  onloading = false;

  private unsubscribe$ = new Subject<void>();

  private streamMessageSubscription = new Subscription();
  canInstall = true;
  ngOnInit() {
    this.uuid = generateUuid();
    this.initialListenStreamMessage();
    this.streamInput.pipe(concatMap((x) => of(x))).subscribe((x) => {
      const str = this.streamMessage.value + x;
      this.streamMessage.next(str);
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.streamMessageSubscription.unsubscribe();
    this.chatService.clearMessage(this.uuid);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewWillEnter() {
    this.scrollToBottom();
  }

  initialListenStreamMessage() {
    this.streamMessageSubscription = this.chatService
      .getChatGptStreamMessage(this.uuid)
      .subscribe((x: any) => {
        const { content, finish_reason } = x;
        if (content) {
          const msg = x.content as string;
          this.streamInput.next(msg);
        } else if (this.onResponding && finish_reason) {
          this.onResponding = false;
          const streamMessage = this.streamMessage.value;
          this.streamMessage.next('');
          const lastMessage = this.listMessage.value.pop();
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.message += streamMessage;
            this.listMessage.next([...this.listMessage.value, lastMessage]);
          } else {
            const newMessage: MessageDto = {
              id: generateUuid(),
              role: 'assistant',
              message: streamMessage,
              senderId: 'assistant',
              timestamp: new Date().getTime(),
            };
            this.listMessage.next([...this.listMessage.value, newMessage]);
          }

          this.chatApi.addGptMessage(streamMessage);
          if (finish_reason === 'length') {
            this.sendMessage();
          }
        }
      });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToBottom(100);
      }
    }, 100);
  }

  sendMessage() {
    if (this.onResponding) {
      return;
    }

    this.onResponding = true;
    if (this.message.length > 0) {
      const currentListMessage = this.listMessage.value;
      const newUserMessage: MessageDto = {
        id: generateUuid(),
        role: 'user',
        message: this.message,
        senderId: this.uuid,
        timestamp: new Date().getTime(),
      };
      currentListMessage.push(newUserMessage);

      this.listMessage.next(currentListMessage);
    }

    this.chatApi
      .sendMessage(this.uuid, this.message)
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((err) => {
          throw err;
        })
      )
      .subscribe(console.log);
    this.message = '';
  }

  clearMessage() {
    if (this.onResponding) {
      return;
    }
    this.chatService.clearMessage(this.uuid);
    this.chatApi.clearMessage();
    this.listMessage.next([]);
    this.uuid = generateUuid();
    this.initialListenStreamMessage();
  }

  stopResponding() {
    this.onResponding = false;
    this.streamMessageSubscription.unsubscribe();
    this.uuid = generateUuid();
    this.initialListenStreamMessage();
    this.streamMessage.next('');
  }

  logout() {
    if (this.onloading) return;
    this.onloading = true;
    this.auth.SignOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  installApp() {}
}
