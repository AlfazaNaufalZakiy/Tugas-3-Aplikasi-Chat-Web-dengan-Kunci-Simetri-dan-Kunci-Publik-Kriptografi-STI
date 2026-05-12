import React, { useState, useEffect } from 'react';
import type { Contact, Message } from '../../types';
import { colors } from '../../theme/colors';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { EmptyChat } from './EmptyChat';
import * as api from '../../utils/api';
import * as crypto from '../../utils/crypto';

interface ChatAreaProps {
  contact: Contact | null;
  currentUser: { email: string, privateKey: CryptoKey } | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ contact, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (contact) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [contact]);

  const fetchMessages = async () => {
    if (!contact || !currentUser) return;
    try {
      const { data } = await api.getMessages(contact.name);
      const processedMessages = await Promise.all(data.map(async (msg: any) => {
        try {
          const decrypted = await crypto.decryptMessage(
            { ciphertext: msg.ciphertext, iv: msg.iv, mac: msg.mac },
            currentUser.privateKey, 
            (contact as any).publicKey,
            msg.sender_email,
            msg.receiver_email
          );
          
          return {
            id: msg.id,
            text: decrypted,
            time: new Date(msg.timestamp).toLocaleTimeString(),
            sent: msg.sender_email === currentUser.email,
            valid: true
          };
        } catch (e) {
          return {
            id: msg.id,
            text: "Message could not be decrypted",
            time: new Date(msg.timestamp).toLocaleTimeString(),
            sent: msg.sender_email === currentUser.email,
            valid: false
          };
        }
      }));
      setMessages(processedMessages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !contact || !currentUser) return;

    try {
      const timestamp = new Date().toISOString();
      
      const encrypted = await crypto.encryptMessage(
        message, 
        (contact as any).publicKey, 
        currentUser.privateKey,
        currentUser.email,
        contact.name
      );

      await api.sendMessage({
        sender_email: currentUser.email,
        receiver_email: contact.name,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        mac: encrypted.mac,
        timestamp: timestamp
      });

      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!contact) {
    return <EmptyChat />;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.bg.chat }}>
      <ChatHeader contact={contact} />
      <MessageList messages={messages} />
      <ChatInput 
        message={message} 
        onMessageChange={setMessage} 
        onSend={handleSendMessage}
      />
    </div>
  );
};
