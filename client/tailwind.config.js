module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  themes: [
    {
      mytheme: {
        "primary": "#336699",    // A more muted blue
        "secondary": "#2d6b2d",  // A more muted green
        "accent": "#2d6b99",     // A more muted blue
        "neutral": "#2d2d2d",    // A slightly darker gray
        "base-100": "#1c293d",   // Same dark blue background
        "info": "#4d99bf",       // A more muted blue
        "success": "#4d994d",    // A more muted green
        "warning": "#b38f00",    // A more muted gold
        "error": "#bf8080",      // A more muted pink
        "muted-red": "#993333",  // A more muted red
      },
    },
  ],
  plugins: [require("daisyui")],
}