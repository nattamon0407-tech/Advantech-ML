// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // บอก Tailwind ให้สแกนไฟล์เหล่านี้เพื่อหา Utility Classes
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {}, // สำหรับการปรับแต่งเพิ่มเติม
  },
  plugins: [],
}