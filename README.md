# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Deployment notes (API)

This project includes a standalone Express server in `/server` that mounts REST endpoints under `/api` (e.g. `/api/auth/login`). When you deploy the frontend to Vercel (or similar static hosts) the Express server is not automatically deployed — which will cause client requests to `/api/...` to return 404.

Options to resolve this for production:

- Deploy the `/server` app separately (Render, Fly, Heroku, Railway, etc.) and set the frontend env var `VITE_API_BASE_URL` to the full server URL (e.g. `https://api.example.com`). The frontend will then call `${VITE_API_BASE_URL}/api/...`.
- Convert server routes into Vercel Serverless Functions under `/api` if you want a single Vercel deployment (non-trivial; requires restructuring Express handlers into individual serverless endpoints).

Quick checklist before going live:

- Set `VITE_API_BASE_URL` in your Vercel environment variables when server is hosted elsewhere.
- Configure `JWT_SECRET` and other secrets for the server (in `/server/.env` or platform env vars).
- Ensure email provider credentials are configured for sending emails (see `/server/EMAIL_SETUP.md`).
- Replace the placeholder Privacy / Terms / Cookies text with your legal copy.
- Add Google Sign-In: implement provider routes on the server and register client ID, or use a third-party auth provider.

### Google OAuth (quick setup)

- Create OAuth credentials in Google Cloud Console (OAuth 2.0 Client IDs).
- Set the **Authorized redirect URI** to: `https://<your-api-host>/api/auth/provider/google/callback` (or `http://localhost:4000/api/auth/provider/google/callback` for local testing).
- Add the credentials as environment variables for the server:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
API_BASE_URL=https://<your-api-host>
JWT_SECRET=some_long_random_secret
```

- Start the server and frontend. The login button will redirect to `/api/auth/provider/google`, Google will redirect back to the server which exchanges the code and issues a JWT, then the server redirects the browser back to the frontend with `?access_token=...` which the app stores in localStorage.

Security note: for production, prefer issuing tokens via secure HTTP-only cookies or a managed auth provider; returning tokens in URL is simple but less secure.
