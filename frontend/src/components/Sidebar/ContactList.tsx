import React from 'react';
import type { Contact } from '../../types';
import { ContactItem } from './ContactItem';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ contacts, onSelectContact }) => {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onClick={() => onSelectContact(contact)} />
      ))}
    </div>
  );
};