import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatGptPageRoutingModule } from './chat-gpt-routing.module';

import { ChatGptPage } from './chat-gpt.page';
import { ChatGptApiService } from './chat-gpt-api.service';
import { MenuComponent } from 'src/app/shared/components/menu.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatGptPageRoutingModule,
    MenuComponent,
    ScrollingModule,
  ],
  declarations: [ChatGptPage],
  providers: [ChatGptApiService],
})
export class ChatGptPageModule {}
