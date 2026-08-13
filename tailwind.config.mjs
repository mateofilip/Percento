/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "select-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(-6px) scale(0.96)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "select-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-6px) scale(0.96)",
          },
        },
        "theme-out": {
          "0%": {
            transform: "rotate(0deg) scale(1)",
            opacity: "1",
          },
          "100%": {
            transform: "rotate(-35deg) scale(0.4)",
            opacity: "0",
          },
        },
        "theme-in": {
          "0%": {
            transform: "rotate(12deg) scale(0.5)",
            opacity: "0",
          },
          "100%": {
            transform: "rotate(0deg) scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "select-in": "select-in 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "select-out": "select-out 150ms ease-in forwards",
        "theme-out": "theme-out 140ms cubic-bezier(0.4, 0, 1, 1) forwards",
        "theme-in": "theme-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1) 80ms both",
      },
    },
  },
  plugins: [],
};
