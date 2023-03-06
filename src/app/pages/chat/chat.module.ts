import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatService } from 'src/app/services/chat.service';
import { ChatServerService } from 'src/app/services/chat-server.service';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatPageRoutingModule],
  declarations: [ChatPage],
  providers: [ChatService, ChatServerService],
})
export class ChatPageModule {}
