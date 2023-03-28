import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import {
  BehaviorSubject,
  concatMap,
  delay,
  filter,
  forkJoin,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { MessageDto, MessageGroupDto } from './dto/message.dto';
import { generateUuid } from './../../helper/tools';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  constructor(private chatService: ChatService) {}
  private unsubscribe$ = new Subject<void>();
  @ViewChild(IonContent, { read: IonContent, static: false }) ionContent:
    | IonContent
    | undefined;

  message = '';
  clientId = '';

  private listMessage = new BehaviorSubject<MessageGroupDto[]>([]);
  listMessage$ = this.listMessage
    .asObservable()
    .pipe(filter((x) => x.length > 0));
  ngOnInit() {
    this.chatService
      .getClientId()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res) {
          this.clientId = res as string;
          this.chatService
            .getMessages()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((messages) => {
              const msg = messages as MessageDto[];
              const updateList: MessageGroupDto[] = [];
              msg.forEach((m) => {
                if (updateList.length == 0) {
                  updateList.push({
                    senderId: m.senderId,
                    type: m.senderId === this.clientId ? 'sender' : 'receiver',
                    messages: [m],
                  });
                } else {
                  const last = updateList[updateList.length - 1];
                  if (last.senderId === m.senderId) {
                    last.messages.push(m);
                  } else {
                    updateList.push({
                      senderId: m.senderId,
                      type:
                        m.senderId === this.clientId ? 'sender' : 'receiver',
                      messages: [m],
                    });
                  }
                }
              });
              this.listMessage.next(updateList);
            });
        }
      });

    this.chatService
      .getChatMessage()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        const msg = res as MessageDto;
        const list = this.listMessage.value;
        const last = list[list.length - 1];
        if (last && last.senderId === msg.senderId) {
          last.messages.push(msg);
        } else {
          list.push({
            senderId: msg.senderId,
            type: msg.senderId === this.clientId ? 'sender' : 'receiver',
            messages: [msg],
          });
        }
        this.listMessage.next(list);
        this.scrollToBottom();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ionViewWillEnter() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToBottom(100);
      }
    }, 100);
  }

  sendMessage() {
    const uuid = generateUuid();
    this.chatService.sendMessage(uuid, this.message);
    this.message = '';
  }
}
