import React, { useState } from 'react';
import type { Contact } from '../../types';
import { colors } from '../../theme/colors';

interface ContactItemProps {
  contact: Contact;
  onClick: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ contact, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        backgroundColor: isHovered ? colors.bg.tertiary : 'transparent',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', overflow: 'hidden' }}>
        <img src={contact.avatar} alt={contact.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ color: colors.text.primary, fontSize: '16px', fontWeight: 400 }}>{contact.name}</span>
          <span style={{ color: colors.text.tertiary, fontSize: '12px' }}>{contact.time}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: colors.text.secondary, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {contact.lastMessage}
          </span>
          {contact.unread && (
            <div style={{ backgroundColor: colors.accent.primary, borderRadius: '50%', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
              <span style={{ color: colors.bg.primary, fontSize: '12px', fontWeight: 500 }}>{contact.unread}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};