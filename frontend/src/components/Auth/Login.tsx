import React, { useState } from 'react';
import { colors } from '../../theme/colors';
import { InputField } from './InputField';
import { Button } from './Button';
import { MessageCircle, Loader } from 'lucide-react';
import { 
  decryptStoredPrivateKey,
  setSession
} from '../../utils/crypto';
import * as api from '../../utils/api';

interface LoginProps {
  onLogin: (email: string, token: string) => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string;
    general?: string 
  }>({});

  const validateCredentials = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateCredentials()) return;

    setIsLoggingIn(true);
    setErrors({});
    
    try {
      const { data } = await api.login(email, password);
      const { token, publicKey, encryptedPrivateKey, kdfSalt, privateKeyIv } = data;
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      const privateKey = await decryptStoredPrivateKey(password, encryptedPrivateKey, kdfSalt, privateKeyIv);
      await setSession(email, privateKey, publicKey, token);
      
      console.log('Login successful!');
      onLogin(email, token);
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoggingIn) {
      handleLogin();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: colors.bg.primary,
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '440px', 
        backgroundColor: colors.bg.secondary, 
        borderRadius: '12px', 
        padding: '48px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: colors.accent.primary, 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {isLoggingIn ? (
              <Loader size={40} color={colors.bg.primary} className="spin" />
            ) : (
              <MessageCircle size={40} color={colors.bg.primary} />
            )}
          </div>
          <h1 style={{ color: colors.text.primary, margin: 0, fontSize: '28px', fontWeight: 500 }}>
            {isLoggingIn ? 'Signing In...' : 'Welcome Back'}
          </h1>
          <p style={{ color: colors.text.secondary, margin: '8px 0 0 0', fontSize: '15px', textAlign: 'center' }}>
            {isLoggingIn 
              ? 'Verifying your identity...' 
              : 'Sign in to continue to ChatApp'}
          </p>
        </div>

        {errors.general && (
          <div style={{
            padding: '12px',
            backgroundColor: colors.error + '20',
            border: `1px solid ${colors.error}30`,
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p style={{ color: colors.error, margin: 0, fontSize: '14px', textAlign: 'center' }}>
              {errors.general}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InputField
            type="text"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={isLoggingIn}
            onKeyPress={handleKeyPress}
          />

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={isLoggingIn}
            onKeyPress={handleKeyPress}
          />

          <Button 
            text={isLoggingIn ? "Signing In..." : "Sign In"} 
            onClick={handleLogin} 
            variant="primary" 
            disabled={isLoggingIn}
          />

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <span style={{ color: colors.text.secondary, fontSize: '14px' }}>
              Don't have an account?{' '}
            </span>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}
              style={{ color: colors.accent.primary, fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}
            >
              Sign Up
            </a>
          </div>
        </div>

        {isLoggingIn && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: colors.accent.primary + '20',
            borderRadius: '8px',
            border: `1px solid ${colors.accent.primary}30`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Loader size={16} color={colors.accent.primary} className="spin" />
              <span style={{ color: colors.accent.primary, fontSize: '12px', fontWeight: 500 }}>
                Performing cryptographic verification...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
