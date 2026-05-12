import type { Contact, Message } from '../types';

export const contacts: Contact[] = [
  { id: 1, name: 'Alice Johnson', lastMessage: 'Hey! How are you doing?', time: '10:30 AM', unread: 3, avatar: '👩', publicKey: '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8' },
  { id: 2, name: 'Bob Smith', lastMessage: 'That sounds great!', time: 'Yesterday', avatar: '👨', publicKey: '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8' },
  { id: 3, name: 'Carol White', lastMessage: 'See you tomorrow 👋', time: 'Tuesday', avatar: '👩‍🦰', publicKey: '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8' },
  { id: 4, name: 'David Brown', lastMessage: 'Thanks for the help!', time: 'Monday', avatar: '👨‍🦱', publicKey: '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8' },
  { id: 5, name: 'Eva Green', lastMessage: 'Perfect timing!', time: 'Sunday', avatar: '👩‍🦳', publicKey: '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8' },
];

export const chatMessages: Message[] = [
  { id: 1, text: 'Hey! How are you doing?', time: '10:25 AM', sent: false },
  { id: 2, text: 'I\'m doing great! Thanks for asking 😊', time: '10:26 AM', sent: true },
  { id: 3, text: 'Want to grab coffee this weekend?', time: '10:27 AM', sent: false },
  { id: 4, text: 'That sounds perfect! Saturday afternoon?', time: '10:30 AM', sent: true },
];