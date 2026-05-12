export interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  publicKey: string;
}

export interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  valid?: boolean;
}

export interface User {
  email: string;
  password: string;
}
