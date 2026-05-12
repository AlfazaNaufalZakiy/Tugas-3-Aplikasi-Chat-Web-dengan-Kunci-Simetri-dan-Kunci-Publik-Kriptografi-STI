/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wa: {
          // Dark backgrounds
          dark: '#111b21',        // Main app background
          darker: '#0b141a',      // Sidebar header / Deep background
          panel: '#202c33',       // Sidebar / Element background
          hover: '#2a3942',       // Hover state
          
          // Accents & Text
          green: '#00a884',       // Primary accent
          teal: '#005c4b',        // Outgoing message bubble
          blue: '#53bdeb',        // Links/System messages
          
          // Text Colors
          'light-gray': '#e9edef', // Primary Text
          'med-gray': '#8696a0',   // Secondary Text / Timestamps
          'icon-gray': '#aebac1',  // Icons
        }
      },
      backgroundImage: {
        // Optional: A subtle pattern for the chat background
        'chat-pattern': "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
      }
    },
  },
  plugins: [],
}