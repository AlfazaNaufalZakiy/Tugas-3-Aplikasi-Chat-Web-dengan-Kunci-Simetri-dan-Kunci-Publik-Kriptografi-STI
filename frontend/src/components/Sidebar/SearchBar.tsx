import React from 'react';
import { Search } from 'lucide-react';
import { colors } from '../../theme/colors';

export const SearchBar: React.FC = () => {
  return (
    <div style={{ padding: '8px 12px', backgroundColor: colors.bg.primary }}>
      <div style={{ backgroundColor: colors.bg.secondary, borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={16} color={colors.text.tertiary} />
        <input
          type="text"
          placeholder="Search or start new chat"
          style={{ background: 'none', border: 'none', outline: 'none', color: colors.text.primary, fontSize: '14px', width: '100%' }}
        />
      </div>
    </div>
  );
};