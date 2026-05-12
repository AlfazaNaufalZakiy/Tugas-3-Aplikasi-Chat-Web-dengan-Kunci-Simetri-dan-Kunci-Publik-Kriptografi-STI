import React from 'react';
import type { Message } from '../../types';
import { colors } from '../../theme/colors';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div style={{ display: 'flex', justifyContent: message.sent ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
      <div
        style={{
          backgroundColor: message.sent ? colors.message.sent : colors.message.received,
          color: colors.text.primary,
          padding: '6px 10px',
          borderRadius: '8px',
          maxWidth: '60%',
          boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ fontSize: '14.5px', lineHeight: '1.4', marginBottom: '4px' }}>{message.text}</div>
        {message.valid === false && (
          <div style={{ fontSize: '11px', color: colors.error, marginBottom: '4px' }}>Invalid or undecryptable</div>
        )}
        <div style={{ fontSize: '11px', color: colors.text.secondary, textAlign: 'right' }}>{message.time}</div>
      </div>
    </div>
  );
};
