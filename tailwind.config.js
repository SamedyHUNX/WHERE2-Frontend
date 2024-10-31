/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Add this line
  ],
  theme: {
    screens: {
      sm: { 'max': "980px" },
      lg: { 'min': "981px" },
    },
    extend: {
      spacing: {
        10: "10px",
        20: "20px",
        30: "30px",
        40: "40px",
        80: "80px",
        100: "100px",
        160: "160px",
        "section-top-margin": "3.9375rem",
        "image-container-top-margin": "5rem",
      },
      padding: {
        'sectional-top': '5rem',
        '14': '3.5rem',
        'sectional-top': '5rem',
        '14': '3.5rem',
      },
      maxWidth: {
        container: "886px",
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "light-100": "#375761",
        "light-300": "#808A8D",
        "light-500": "#ADB6B9",
        "light-700": "#ECEEEF",
        "light-900": "#FBFBFB",
        primary: "#7CD1EB",
        // tremor colors
        tremor: {
          brand: {
            faint: "#eff6ff",  // blue-50
            muted: "#bfdbfe",  // blue-200
            subtle: "#60a5fa",  // blue-400
            DEFAULT: "#3b82f6",  // blue-500
            emphasis: "#1d4ed8",  // blue-700
            inverted: "#ffffff",  // white
          },
          background: {
            muted: "#f9fafb",  // gray-50
            subtle: "#f3f4f6",  // gray-100
            DEFAULT: "#ffffff",  // white
            emphasis: "#374151",  // gray-700
          },
          border: {
            DEFAULT: "#e5e7eb",  // gray-200
          },
          ring: {
            DEFAULT: "#e5e7eb",  // gray-200
          },
          content: {
            subtle: "#9ca3af",  // gray-400
            DEFAULT: "#6b7280",  // gray-500
            emphasis: "#374151",  // gray-700
            strong: "#111827",  // gray-900
            inverted: "#ffffff",  // white
          },
        },
      },
      letterSpacing: {
        tightest: "-.075em",
        tighter: "-.05em",
        tight: "-.03em",
        normal: "0",
        wide: ".025em",
        wider: ".05em",
        widest: ".1em",
      },
      backgroundImage: {
        "gray-primary": "linear-gradient(180deg, #E3E3E3 0%, #EEEEEE 19%, #FFFFFF 82%, #F6F6F6 100%)",
      },
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      fontSize: {
        "tremor-label": ["0.75rem"],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.clip-border-box': {
          'clip-path': 'border-box',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};