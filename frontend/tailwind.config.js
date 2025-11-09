import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // WhatsApp Colors
        wa: {
          // Light theme
          primary: '#25D366',      // WhatsApp green
          dark: '#075E54',         // Dark green header
          teal: '#128C7E',         // Teal accent
          'light-green': '#DCF8C6', // Sent message
          'bg': '#ECE5DD',         // Chat background
          'panel': '#F0F2F5',      // Sidebar
          'border': '#E9EDEF',     // Borders
          
          // Dark theme
          'dark-bg': '#0B141A',    // Main dark
          'dark-panel': '#111B21', // Sidebar dark
          'dark-msg': '#202C33',   // Received dark
          'dark-sent': '#005C4B',  // Sent dark
          'dark-border': '#2A3942',
          'dark-text': '#E9EDEF',
          
          // Status colors
          'blue': '#53BDEB',       // Read checkmark
          'gray': '#667781',       // Unread checkmark
        }
      },
      animation: {
        border: "border 4s linear infinite",
      },
      keyframes: {
        border: {
          to: { "--border-angle": "360deg" },
        },
      },
      backgroundImage: {
        'whatsapp-light': "url('/whatsapp-bg-light.png')",
        'whatsapp-dark': "url('/whatsapp-bg-dark.png')",
      }
    },
  },
  plugins: [daisyui],
};
