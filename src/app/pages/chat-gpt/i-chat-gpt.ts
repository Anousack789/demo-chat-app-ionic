export interface IChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string | undefined;
}
