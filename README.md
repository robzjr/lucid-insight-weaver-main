# Lucid Insight Weaver

Lucid Insight Weaver is a modern, full-stack web application for dream interpretation, user engagement, and subscription management. Built with React, Vite, TypeScript, Supabase, and Tailwind CSS, it offers a beautiful, responsive UI and robust backend integrations.

## Features

- **Dream Interpretation**: Users can input dreams and receive AI-powered interpretations.
- **Authentication**: Secure sign-up, login, and password management via Supabase.
- **Subscription & Payments**: Integrated with PayPal and Paymob for flexible subscription plans.
- **Referral System**: Users can refer friends and earn rewards.
- **User Profile & Preferences**: Manage personal info, preferences, and usage.
- **Multi-language Support**: Easily switch between supported languages.
- **Responsive UI**: Built with Tailwind CSS and shadcn/ui components for a seamless experience.
- **Admin & Support**: Includes help/support, onboarding, and account management features.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres, Auth, Functions)
- **Payments**: PayPal, Paymob
- **Other**: ESLint, PostCSS, Netlify/Vercel deployment

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/lucid-insight-weaver.git
   cd lucid-insight-weaver-main
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase and payment credentials.

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:8080`.

### Build for Production

```sh
npm run build
# or
yarn build
```
The output will be in the `dist/` directory.

### Linting

```sh
npm run lint
# or
yarn lint
```

## Project Structure

```
├── src/
│   ├── components/         # UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Supabase and other integrations
│   ├── lib/                # Utilities and Supabase client
│   ├── pages/              # Page components
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── supabase/               # Supabase functions and migrations
├── .env                    # Environment variables
├── package.json            # Project metadata and scripts
├── tailwind.config.ts      # Tailwind CSS config
├── vite.config.ts          # Vite config
└── ...
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_APP_URL=your-app-url
VITE_REDIRECT_URI=your-redirect-uri
```

## Deployment

- **Netlify**: Uses `netlify.toml` for build and redirects.
- **Vercel**: Supported via Vercel dashboard.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

[MIT](LICENSE)

## Acknowledgements

- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)

---

*Where your dreams whisper, and meanings unfold.*

