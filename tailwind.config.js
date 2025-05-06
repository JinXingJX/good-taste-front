/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // Use import instead of require

export default {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      // "./public/index.html" // This might be unnecessary for React Router projects
    ],
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '65ch', // Example, adjust as needed
              color: 'inherit',
              a: {
                color: '#3182ce', // Example link color
                '&:hover': {
                  color: '#2c5282', // Example link hover color
                },
                // Add other prose styles if needed
              },
              // Ensure prose styles for dark mode if applicable
              '.dark code': { // Example for dark mode code blocks
                 color: '#cbd5e1', // text-slate-300
              },
              // Add more specific prose overrides here
            },
          },
        },
        // Add other theme extensions here
      },
    },
    plugins: [
      typography, // Use the imported plugin
      // Add other plugins here
    ],
  }
