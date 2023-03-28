export interface MessageDto {
  id: string;
  message: string;
  senderId: string;
  timestamp: number;
}
export interface MessageGroupDto {
  type: 'sender' | 'receiver';
  senderId: string;
  messages: MessageDto[];
}
