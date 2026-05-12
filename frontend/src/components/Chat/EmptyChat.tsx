import React from "react";
import { colors } from "../../theme/colors";

export const EmptyChat: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: colors.bg.chat,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div style={{ fontSize: "80px" }}>💬</div>
      <h2 style={{ color: colors.text.primary, margin: 0 }}>ChatApp Web</h2>
      <p
        style={{
          color: colors.text.secondary,
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        Send and receive messages without keeping your phone online.
      </p>
    </div>
  );
};
