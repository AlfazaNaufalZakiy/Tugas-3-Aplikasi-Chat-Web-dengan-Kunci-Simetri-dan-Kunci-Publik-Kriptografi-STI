import React, { useState } from 'react';
import { colors } from '../../theme/colors';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: '14px 16px',
        backgroundColor: disabled 
          ? colors.bg.tertiary 
          : isPrimary 
            ? (isHovered ? colors.accent.hover : colors.accent.primary)
            : 'transparent',
        border: isPrimary ? 'none' : `1px solid ${colors.accent.primary}`,
        borderRadius: '8px',
        color: disabled ? colors.text.tertiary : (isPrimary ? colors.bg.primary : colors.accent.primary),
        fontSize: '15px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        boxSizing: 'border-box',
        opacity: disabled ? 0.7 : 1,
        ...style
      }}
    >
      {text}
    </button>
  );
};