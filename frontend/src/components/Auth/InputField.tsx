import React from 'react';
import { colors } from '../../theme/colors';

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  error,
  disabled = false,
  onKeyPress 
}) => {
  return (
    <div style={{ width: '100%' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '14px 16px',
          backgroundColor: disabled ? colors.bg.tertiary : colors.bg.primary,
          border: `1px solid ${error ? colors.error : colors.border}`,
          borderRadius: '8px',
          color: colors.text.primary,
          fontSize: '15px',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => {
          if (!error && !disabled) {
            e.target.style.borderColor = colors.accent.primary;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? colors.error : colors.border;
        }}
      />
      {error && (
        <div style={{ color: colors.error, fontSize: '13px', marginTop: '6px', marginLeft: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};