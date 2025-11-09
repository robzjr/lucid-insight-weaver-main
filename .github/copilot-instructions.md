# Lucid Insight Weaver - AI Coding Agent Instructions

## Project Overview
Dream interpretation SaaS application built with React + TypeScript + Vite frontend, Supabase backend (PostgreSQL + Auth + Edge Functions), and dual payment gateways (PayPal + Paymob). Features AI-powered dream analysis with multi-language support (Arabic/English).

## Critical Architecture Patterns

### State Management & Data Flow
- **No Redux/Zustand**: Uses React Query (`@tanstack/react-query`) for server state + React Context for global UI state
- **Custom hooks pattern**: All business logic in `src/hooks/` - `useAuth`, `useDreams`, `useUserUsage`, `useReferralSystem`, `useUserProfile`, `useUserPreferences`
- **Query keys**: Use format `['resource', userId]` for cache invalidation (e.g., `['dreams', user?.id]`)
- **Single source of truth**: Main app state lives in `src/pages/Index.tsx` with screen switching logic

### Supabase Integration
- **Dual client setup**: `src/lib/supabase-client.ts` AND `src/integrations/supabase/client.ts` - use the latter for consistency
- **Edge Functions**: All backend operations via `supabase.functions.invoke()` - NEVER direct database mutations from frontend
  - `interpret-dream`: AI dream analysis using Google Gemini API
  - `create-payment` / `create-paypal-payment`: Payment initiation
  - `process-referral`: Referral rewards processing
  - `*-webhook`: Payment confirmation handlers
- **Auth pattern**: `useAuth` hook listens to `supabase.auth.onAuthStateChange()` - no manual session management
- **RLS enabled**: All tables have Row-Level Security policies - always filter by `user_id`

### UI Component Architecture
- **shadcn/ui**: All UI components in `src/components/ui/` using Radix primitives + CVA (class-variance-authority)
- **Theme system**: Dark/light mode via `next-themes` stored in user preferences table - NOT localStorage
- **i18n**: Custom translation system in `LanguageContext` - use `t('key')` function, NOT external i18n libraries
- **Import alias**: ALWAYS use `@/` prefix (e.g., `@/components/ui/button`) - configured in `vite.config.ts` and `tsconfig.json`

### Payment Flow
```
User clicks package → PaymentModal → supabase.functions.invoke('create-*-payment') → 
→ Redirect to gateway → Webhook (*-webhook function) → Update user_usage table → Invalidate queries
```
- **Dual providers**: User selects Paymob (EGP) or PayPal (multi-currency) via radio buttons
- **Transaction tracking**: `payment_transactions` table stores all attempts - check `status` field
- **Usage updates**: NEVER manually update `user_usage` - let webhook functions handle it

### Referral System
- Referrer earns credits when referred user makes first payment
- Process triggered by `process-referral` Edge Function from webhook
- Credits stored in `user_usage.paid_interpretations_remaining`
- Referred users tracked via `referrals` table with `referrer_id` → `referred_id` relationship

## Development Workflow

### Running the App
```bash
npm run dev          # Starts Vite dev server on port 8080
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint check
```

### Working with Supabase
- Local functions: Run `supabase functions serve` (requires Docker)
- Deploy functions: `supabase functions deploy <function-name>`
- Run migrations: Auto-applied via Supabase CLI or dashboard
- Types: Regenerate `src/types/database.types.ts` with `supabase gen types typescript --local > src/types/database.types.ts`

### Environment Variables
```env
VITE_SUPABASE_URL=           # Required for all operations
VITE_SUPABASE_ANON_KEY=      # Public anon key
VITE_PAYPAL_CLIENT_ID=       # PayPal sandbox/production ID
VITE_APP_URL=                # For OAuth redirects
VITE_REDIRECT_URI=           # Post-auth redirect
```
Edge Functions use separate env vars set via Supabase dashboard (e.g., `GOOGLE_AI_API_KEY`, `PAYPAL_SECRET`)

## Common Pitfalls & Conventions

### Database Column Naming
- **CRITICAL**: Backend uses snake_case (`display_name`, `relationship_status`), frontend uses camelCase
- When updating profiles: `updateProfile({ display_name: value })` NOT `displayName`
- Example in `src/pages/Index.tsx:74-80` shows correct mapping

### Authentication Edge Cases
- Always check `user` AND `loading` state: `if (!user && !loading) return <AuthPage />`
- onAuthStateChange fires on tab focus - avoid duplicate API calls
- Sign out clears all React Query cache - manually reset local state

### React Query Patterns
- Enable queries conditionally: `enabled: !!user` prevents 401 errors
- Invalidate after mutations: `queryClient.invalidateQueries({ queryKey: ['dreams'] })`
- Error handling: Use `onError` in mutations, display with `toast.error()`

### UI Component Usage
- Button variants: `default | destructive | outline | secondary | ghost | link`
- Use `cn()` helper from `@/lib/utils` to merge Tailwind classes
- Dialog/modal state: Lift state to parent component, pass via props

### Edge Function Development
- Use CORS headers in all responses (see `interpret-dream/index.ts:4-7`)
- Always validate request body fields exist before using
- Log extensively: `console.log()` visible in Supabase function logs
- Handle OPTIONS requests for preflight: `if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })`

## File Organization Rules
- **Components**: Flat structure in `src/components/` - settings components in `settings/` subdirectory
- **Hooks**: One hook per file, named `use[Feature].tsx`
- **Pages**: Minimal - only `Index.tsx` and `NotFound.tsx` (single-page app with screen switching)
- **Types**: Database types in `database.types.ts` - export interfaces, NOT inline types

## Adding New Features

### New Payment Package
1. Add to `paymentPackages` array in `PaymentModal.tsx`
2. Update webhook handlers to recognize new package ID
3. Test with both Paymob and PayPal sandbox accounts

### New Dream Interpretation Type
1. Add translation keys to `LanguageContext` for both `en` and `ar`
2. Update `interpret-dream` Edge Function prompt engineering
3. Modify `InterpretationDisplay` to show new type
4. Update `interpretations` table schema if storing permanently

### New Screen/Page
1. Add screen type to `ScreenType` union in `Index.tsx`
2. Create component in `src/components/`
3. Add navigation item to `Navigation.tsx`
4. Update conditional rendering in `Index.tsx` main render

## Testing Checklist
- [ ] Test with both authenticated and unauthenticated states
- [ ] Verify dark/light theme switching persists
- [ ] Check Arabic language renders correctly (RTL layout)
- [ ] Test payment flow in sandbox (both providers)
- [ ] Verify referral credits apply after webhook
- [ ] Confirm usage limits enforced (free vs paid interpretations)

## Deployment
- **Frontend**: Netlify auto-deploys from main branch (config in `netlify.toml`)
- **Redirects**: SPA routing via `public/_redirects` file
- **Backend**: Edge Functions auto-deploy via Supabase Git integration
- **Database**: Migrations run automatically on push to main

## Key Files to Reference
- `src/pages/Index.tsx` - Main app orchestration and state management
- `src/hooks/useDreams.tsx` - Dream interpretation logic and Edge Function calls
- `src/components/PaymentModal.tsx` - Complete payment flow implementation
- `supabase/functions/interpret-dream/index.ts` - AI integration pattern with Google Gemini
- `src/contexts/LanguageContext.tsx` - All user-facing text strings
