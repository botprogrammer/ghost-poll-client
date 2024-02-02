/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a101f", // deep navy/blue-black
        foreground: "#f5f7fa", // light text
        border: "#232c43", // subtle border
        "border-foreground": "#f5f7fa",
        card: "#11182a", // slightly lighter for cards
        "card-foreground": "#f5f7fa",
        popover: "#11182a",
        "popover-foreground": "#f5f7fa",
        primary: {
          DEFAULT: "#3b82f6", // blue accent
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#232c43",
          foreground: "#f5f7fa",
        },
        muted: {
          DEFAULT: "#a3adc2",
          foreground: "#a3adc2",
        },
        accent: {
          DEFAULT: "#3b82f6",
          foreground: "#fff",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#fff",
        },
        input: "#232c43",
        ring: "#3b82f6",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
    },
  },
  plugins: [],
};
