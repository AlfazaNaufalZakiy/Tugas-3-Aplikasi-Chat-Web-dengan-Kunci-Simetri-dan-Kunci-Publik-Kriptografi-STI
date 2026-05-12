import React from "react";
import { Send } from "lucide-react";
import { colors } from "../../theme/colors";

interface ChatInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onSend,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.bg.secondary,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        style={{
          flex: 1,
          backgroundColor: colors.bg.tertiary,
          border: "none",
          outline: "none",
          color: colors.text.primary,
          padding: "10px 12px",
          borderRadius: "8px",
          fontSize: "15px",
        }}
      />
      {message ? (
        <Send
          size={24}
          color={colors.accent.primary}
          style={{ cursor: "pointer" }}
          onClick={onSend}
        />
      ) : (
        <Send size={24} color={colors.accent.secondary} />
      )}
    </div>
  );
};
