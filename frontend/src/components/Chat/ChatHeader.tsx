import React from 'react';
import type { Contact } from '../../types';
import { colors } from '../../theme/colors';

interface ChatHeaderProps {
  contact: Contact;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div style={{ backgroundColor: colors.bg.secondary, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: colors.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',overflow: 'hidden' }}>
          <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ color: colors.text.primary, fontSize: '16px' }}>{contact.name}</div>
          <div style={{ color: colors.text.secondary, fontSize: '13px' }}>online</div>
        </div>
      </div>
    </div>
  );
};