import React, { useState } from "react";
import { MessageCircle, MoreVertical } from "lucide-react";
import { colors } from "../../theme/colors";

interface SidebarHeaderProps {
  onAddContact?: (email: string) => void;
  onLogout?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onAddContact, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [newContact, setNewContact] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentPrivateKey');
    sessionStorage.removeItem('sessionToken');
    
    console.log("Logged user out");
    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  const handleAddUser = () => {
    if (!newContact.trim()) return;
    if (onAddContact) onAddContact(newContact);
    setNewContact("");
    setIsUserDropdownOpen(false);
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg.secondary,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 20,
      }}
    >
      <h2
        style={{
          color: colors.text.primary,
          margin: 0,
          fontSize: "16px",
          fontWeight: 400,
        }}
      >
        ChatApp
      </h2>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        
        {/* --- NEW USER SECTION --- */}
        <div style={{ position: "relative" }}>
          <MessageCircle
            size={20}
            color={colors.text.secondary}
            style={{ cursor: "pointer" }}
            onClick={() => {
                setIsUserDropdownOpen(!isUserDropdownOpen);
                setIsMenuOpen(false);
            }}
          />

          {isUserDropdownOpen && (
            <>
              {/* Invisible Backdrop to close menu when clicking outside */}
              <div 
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}
                onClick={() => setIsUserDropdownOpen(false)}
              />
              
              {/* The Dropdown Container */}
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  right: "-50px", 
                  backgroundColor: colors.bg.secondary,
                  border: `1px solid ${colors.text.secondary}20`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  padding: "16px",
                  width: "250px",
                  zIndex: 40,
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", color: colors.text.primary }}>New Chat</h4>
                <input
                  type="text"
                  placeholder="Email"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleAddUser}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#00a884",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600
                  }}
                >
                  Start Chat
                </button>
              </div>
            </>
          )}
        </div>

        {/* --- LOGOUT SECTION --- */}
        <div style={{ position: "relative" }}>
          <MoreVertical
            size={20}
            color={colors.text.secondary}
            style={{ cursor: "pointer" }}
            onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setIsUserDropdownOpen(false);
            }}
          />

          {isMenuOpen && (
            <>
              {/* Invisible Backdrop for Logout Menu */}
              <div 
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 30 }}
                onClick={() => setIsMenuOpen(false)}
              />
              
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  right: "0",
                  backgroundColor: colors.bg.secondary, 
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "4px",
                  padding: "8px 0",
                  minWidth: "150px",
                  zIndex: 40,
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: colors.text.primary,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
