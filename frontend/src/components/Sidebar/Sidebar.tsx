import React from 'react';
import type { Contact } from '../../types';
import { colors } from '../../theme/colors';
import { SidebarHeader } from './SidebarHeader';
import { SearchBar } from './SearchBar';
import { ContactList } from './ContactList';

interface SidebarProps {
  contacts: Contact[];
  onSelectChat: (contact: Contact) => void;
  onAddContact?: (email: string) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ contacts, onSelectChat, onAddContact, onLogout }) => {
  return (
    <div style={{ width: '30%', backgroundColor: colors.bg.primary, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SidebarHeader onAddContact={onAddContact} onLogout={onLogout} />
      <SearchBar />
      <ContactList contacts={contacts} onSelectContact={onSelectChat} />
    </div>
  );
};
