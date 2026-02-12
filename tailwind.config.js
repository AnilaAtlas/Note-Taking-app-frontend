//  import('tailwindcss').Config
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./frontend/**/*.{js,jsx,ts,tsx,html}" ,
    "my-project/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: { extend: {} },
  plugins: [],
};