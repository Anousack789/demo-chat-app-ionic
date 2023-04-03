export interface MessageDto {
  id: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  senderId: string;
  timestamp: number;
}
export interface MessageGroupDto {
  type: 'sender' | 'receiver';
  senderId: string;
  messages: MessageDto[];
}
