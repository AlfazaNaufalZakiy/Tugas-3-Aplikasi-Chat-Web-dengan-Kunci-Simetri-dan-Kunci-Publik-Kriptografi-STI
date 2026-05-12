import React, { useState } from "react";
import { colors } from "../../theme/colors";
import { InputField } from "./InputField";
import { Button } from "./Button";
import { MessageCircle } from "lucide-react";
import { generateRegistrationKeys } from "../../utils/crypto";
import * as api from "../../utils/api";

interface RegisterProps {
  onRegister: (email: string, publicKey: string) => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsGeneratingKeys(true);
    
    try {
      const keyMaterial = await generateRegistrationKeys(password);
      const { data } = await api.register({ email, password, ...keyMaterial });

      // Show success message
      alert(`Registration Successful!\n\nEmail: ${email}\nUser ID: ${data.userId}\n\nYou can now login with your email and password.`);
      
      // Call the onRegister callback
      onRegister(email, keyMaterial.publicKey);
      
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ 
        email: error instanceof Error ? error.message : "Registration failed. Please try again." 
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: colors.bg.primary,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: colors.bg.secondary,
          borderRadius: "12px",
          padding: "48px 40px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: colors.accent.primary,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <MessageCircle size={40} color={colors.bg.primary} />
          </div>
          <h1
            style={{
              color: colors.text.primary,
              margin: 0,
              fontSize: "28px",
              fontWeight: 500,
            }}
          >
            Create Account
          </h1>
          <p
            style={{
              color: colors.text.secondary,
              margin: "8px 0 0 0",
              fontSize: "15px",
            }}
          >
            Sign up to get started with ChatApp
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InputField
            type="text"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            disabled={isGeneratingKeys}
          />

          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            disabled={isGeneratingKeys}
          />

          <InputField
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            disabled={isGeneratingKeys}
          />

          <Button
            text={isGeneratingKeys ? "Registering..." : "Create Account"}
            onClick={handleSubmit}
            variant="primary"
            disabled={isGeneratingKeys}
          />

          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <span style={{ color: colors.text.secondary, fontSize: "14px" }}>
              Already have an account?{" "}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              style={{
                color: colors.accent.primary,
                fontSize: "14px",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
