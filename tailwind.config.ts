
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				ton: "#0098EA",
				app: {
					dark: "#1A1F2C",
					purple: "#8B5CF6",
					pink: "#D946EF",
					lightPurple: "#E5DEFF",
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
						opacity: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
						opacity: '1'
					},
					to: {
						height: '0',
						opacity: '0'
					}
				},
				'flip': {
					'0%, 100%': { transform: 'rotateY(0deg)' },
					'50%': { transform: 'rotateY(180deg)' }
				},
				'roll': {
					'0%': { transform: 'rotateX(0deg) rotateY(0deg)' },
					'25%': { transform: 'rotateX(90deg) rotateY(90deg)' },
					'50%': { transform: 'rotateX(180deg) rotateY(180deg)' },
					'75%': { transform: 'rotateX(270deg) rotateY(270deg)' },
					'100%': { transform: 'rotateX(360deg) rotateY(360deg)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', filter: 'brightness(1)' },
					'50%': { opacity: '0.8', filter: 'brightness(1.2)' }
				},
				'dice-roll': {
					'0%': { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
					'25%': { transform: 'rotateX(90deg) rotateY(180deg) rotateZ(45deg)' },
					'50%': { transform: 'rotateX(180deg) rotateY(90deg) rotateZ(90deg)' },
					'75%': { transform: 'rotateX(270deg) rotateY(270deg) rotateZ(135deg)' },
					'100%': { transform: 'rotateX(360deg) rotateY(360deg) rotateZ(180deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'flip': 'flip 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
				'roll': 'roll 1s cubic-bezier(0.455, 0.030, 0.515, 0.955) both',
				'float': 'float 3s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'dice-roll': 'dice-roll 2s cubic-bezier(0.3, 1, 0.4, 1) forwards'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'glass-background': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
				'purple-pink-gradient': 'linear-gradient(90deg, #8B5CF6, #D946EF)',
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'neon': '0 0 5px theme("colors.app.purple"), 0 0 20px theme("colors.app.purple")',
				'neon-pink': '0 0 5px theme("colors.app.pink"), 0 0 20px theme("colors.app.pink")',
				'dice': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.8)',
			},
			backdropFilter: {
				'glass': 'blur(4px)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
