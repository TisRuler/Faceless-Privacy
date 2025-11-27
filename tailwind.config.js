/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../src/pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkTheme: "facelessDarkMode",
  daisyui: {
    themes: [
      {
        facelessDarkMode: {
          // Bg
          "--background-lines": "#111111",
          "--background-symbol-base": "#1C261A",
          "--background-symbol-100": "#93CC8A",
          "--background-symbol-200": "#191919",

          // Main Ui
          "--main-base": "#ffffff",
          "--main-100": "#C3C3C3",
          "--main-200": "#AAAAAA",
          "--main-300": "#808080",
          "--main-400": "#777777",
          "--main-500": "#333333",

          // Modal
          "--modal-frame": "#101010",
          "--modal-border": "#6E6E6E",
          "--modal-accent-100": "#5A5A5A",
          "--modal-accent-200": "#2C2C2C",
          "--modal-accent-300": "#252525",
          "--modal-accent-400": "#212121",
          "--modal-accent-500": "#000000",
          "--modal-base": "#ffffff",
          "--modal-100": "#C0C0C0",
          "--modal-200": "#9F9F9F",
          "--modal-300": "#000000",
          "--modal-token-icon": "#525252",
          "--modal-action-button": "#ffffff",

          // Other
          primary: "#8981CC",
          "card-border": "#000000",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        isb: ["isb"],
        ib: ["ib"],
        im: ["im"],
      },
      colors: {
        cardButtonBg: "#15101F",

        "background-lines": "var(--background-lines)",
        "background-symbol-base": "var(--background-symbol-base)",
        "background-symbol-100": "var(--background-symbol-100)",
        "background-symbol-200": "var(--background-symbol-200)",

        "main-base": "var(--main-base)",
        "main-100": "var(--main-100)",
        "main-200": "var(--main-200)",
        "main-300": "var(--main-300)",
        "main-400": "var(--main-400)",
        "main-500": "var(--main-500)",

        "modal-frame": "var(--modal-frame)",
        "modal-border": "var(--modal-border)",
        "modal-accent-100": "var(--modal-accent-100)",
        "modal-accent-200": "var(--modal-accent-200)",
        "modal-accent-300": "var(--modal-accent-300)",
        "modal-accent-400": "var(--modal-accent-400)",
        "modal-accent-500": "var(--modal-accent-500)",
        "modal-base": "var(--modal-base)",
        "modal-100": "var(--modal-100)",
        "modal-200": "var(--modal-200)",
        "modal-300": "var(--modal-300)",
        "modal-token-icon": "var(--modal-token-icon)",
        "modal-action-button": "var(--modal-action-button)",
      },
      backgroundImage: {
        "primary-button-gradient": "linear-gradient(to bottom, #000000, #5B0DC3)",
      },
      dropShadow: {
        card: "0em 1.5em 3em black",
      },
    },
  },
};
