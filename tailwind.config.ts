import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: "#F0A16B",
  			secondary: "#345569",
  			tertiary: '#438692',
  			dark1: '#2A2A2A',
  			dark2: '#393838',
  			dark3: '#5D5D5D',
  			light1: '#FFFFFF',
  			light2: '#F2F2F2',
  			light3: '#DCDCDC',
			inspireRed: '#C32B1D',
			inspireBlue: '#3377C4',
			inspireGreen: '#499F55',
			inspireYellow: '#F7CD47',
			mainbackground: '#FBFBFB',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		borderWidth: {
		'6': '6px',
		},
		keyframes: {
		"accordion-down": {
			from: { height: "0" },
			to: { height: "var(--radix-accordion-content-height)" },
		},
		"accordion-up": {
			from: { height: "var(--radix-accordion-content-height)" },
			to: { height: "0" },
		},
		},
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		},
		screens: {
			'xs': '440px',
		  },
  	}
  },
  plugins: [require("tailwindcss-animate")],
  
} satisfies Config;
