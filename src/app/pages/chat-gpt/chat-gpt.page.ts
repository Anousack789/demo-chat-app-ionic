import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  delay,
  filter,
  of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { generateUuid } from 'src/app/helper/tools';
import { ChatService } from 'src/app/services/chat.service';
import { MessageGroupDto } from '../chat/dto/message.dto';
import { ChatGptApiService } from './chat-gpt-api.service';

type MessageType = 'sender' | 'receiver';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.page.html',
  styleUrls: ['./chat-gpt.page.scss'],
})
export class ChatGptPage implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private chatApi: ChatGptApiService
  ) {}

  message = '';
  private streamInput = new Subject<string>();
  private streamMessage = new BehaviorSubject<string>('');
  private listMessage = new BehaviorSubject<MessageGroupDto[]>([]);
  listMessage$ = this.listMessage.asObservable();
  streamMessage$ = this.streamMessage.asObservable();
  @ViewChild(IonContent, { read: IonContent, static: false }) ionContent:
    | IonContent
    | undefined;

  onResponding = false;
  private uuid = '';

  private unsubscribe$ = new Subject<void>();

  private streamMessageSubscription = new Subscription();

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
          const newMessage = this.streamMessage.value;
          this.streamMessage.next('');
          const lastMessage =
            this.listMessage.value[this.listMessage.value.length - 1];
          if (lastMessage && lastMessage.type === 'receiver') {
            const newReceiverMessage = {
              ...lastMessage,
              messages: [
                ...lastMessage.messages,
                {
                  id: generateUuid(),
                  senderId: 'gpt',
                  message: newMessage,
                  timestamp: new Date().getTime(),
                },
              ],
            };
            this.listMessage.next([
              ...this.listMessage.value.slice(0, -1),
              newReceiverMessage,
            ]);
          } else {
            const newReceiverMessage = {
              type: 'receiver' as MessageType,
              senderId: 'gpt',
              messages: [
                {
                  id: generateUuid(),
                  senderId: 'gpt',
                  message: newMessage,
                  timestamp: new Date().getTime(),
                },
              ],
            };
            this.listMessage.next([
              ...this.listMessage.value,
              newReceiverMessage,
            ]);
          }

          this.chatApi.addGptMessage(newMessage);
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
      const newUserMessage = {
        type: 'sender' as MessageType,
        senderId: 'user',
        messages: [
          {
            id: generateUuid(),
            senderId: 'user',
            message: this.message,
            timestamp: new Date().getTime(),
          },
        ],
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
}
