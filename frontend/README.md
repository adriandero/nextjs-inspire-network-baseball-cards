# IN - TUG Cards

This is a  [Next.js](https://nextjs.org) project 

We use:

- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- Kebab-case for **file and directory names** (`example-component.tsx`, `my-feature/`)

## Getting Started

Install all npm packages:
```bash
npm i
```
run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


before pushing, build the project with:
```bash
 npx next build
```
## Project Structure
```
src/
├── app/                # Next.js app directory (routes, layouts, etc.)
├── features/           # Application features (business logic, UI, hooks, tests)
│   └── <feature-name>/     # feature with its own components, hooks, etc.
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── shared/             # Reusable UI components, constants, and utilities
│   ├── components/
│   ├── icons/
│   └── utils/
├── hooks/              # Generic, reusable hooks (e.g. useDebounce, useMediaQuery)
├── types/              # Global TypeScript types and enums
├── lib/                # External service wrappers (e.g. API clients, auth, PDF)
│
public/
├── images/             # PNGs, JPGs, backgrounds, photos, etc.
├── icons/              # SVG icons or icon sprites
├── illustrations/      # Artistic graphics, illustrations, vector art
├── json/               # Static JSON files (mock data, configs)
├── fonts/              # Custom fonts if any (rare, usually handled by next/font)
└── docs/               # PDFs, manuals, etc. (if any)
```
## Fonts
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

