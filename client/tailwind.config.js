module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  themes: [
    {
      mytheme: {
        "primary": "#0098b3",
        "secondary": "#00a900",
        "accent": "#00bbff",
        "neutral": "#292929",
        "base-100": "#1c293d",
        "info": "#00e8ff",
        "success": "#5ab400",
        "warning": "#ffb700",
        "error": "#ff829e",
      },
    },
  ],
  plugins: [require("daisyui")],
}