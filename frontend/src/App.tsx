import React, { useState, useEffect } from 'react';
import type { Contact } from './types';
import { colors } from './theme/colors';
import { Sidebar } from './components/Sidebar/Sidebar';
import { ChatArea } from './components/Chat/ChatArea';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import * as api from './utils/api';
import { clearUserSession, getCurrentUserKeyPair } from './utils/crypto';

type AuthView = 'login' | 'register' | 'chat';

const App: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentUser, setCurrentUser] = useState<{email: string, privateKey: CryptoKey, publicKey: string} | null>(null);

  // Check for existing session on load
  useEffect(() => {
    const token = sessionStorage.getItem('sessionToken');
    const email = sessionStorage.getItem('currentUser');
    
    if (token && email) {
      getCurrentUserKeyPair().then((keys) => {
      if (keys) {
        setCurrentUser({ 
          email, 
          privateKey: keys.privateKey, 
          publicKey: keys.publicKey 
        });
        setAuthView('chat');
        fetchContacts();
      }
      });
    }
  }, []);

  const handleLogin = async (email: string, _token: string) => {
    const keys = await getCurrentUserKeyPair();
    if (keys) {
      setCurrentUser({ 
        email, 
        privateKey: keys.privateKey, 
        publicKey: keys.publicKey 
      });
      setAuthView('chat');
      fetchContacts();
    } else {
      console.error("Login successful but keys not found in storage");
      // Should probably logout or show error
    }
  };

  const handleRegister = (_email: string, _publicKey: string) => {
    // Registration successful, switch to login
    setAuthView('login');
  };

  const fetchContacts = async () => {
    try {
      const { data } = await api.getContacts();
      const mappedContacts = data.map((c: any) => ({
        id: c.id,
        name: c.email,
        publicKey: c.publicKey,
        lastMessage: '',
        time: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.email)}`
      }));
      setContacts(mappedContacts);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    setAuthView('login');
  };

  if (authView === 'login') {
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
  }

  if (authView === 'register') {
    return <Register onRegister={handleRegister} onSwitchToLogin={() => setAuthView('login')} />;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: colors.bg.primary }}>
      <Sidebar 
        contacts={contacts} 
        onSelectChat={setSelectedContact} 
        onAddContact={async () => {
          fetchContacts();
        }}
        onLogout={handleLogout}
      />
      <ChatArea contact={selectedContact} currentUser={currentUser} />
    </div>
  );
};

export default App;
