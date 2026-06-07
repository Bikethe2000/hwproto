# hwproto server

Lightweight Express backend used by the hwproto frontend. Provides:
- Auth (email/password) using Firebase Firestore as the user store
- Entity CRUD via Firestore
- File uploads (stored in `server/uploads/` by default)
- Email sending via SMTP (or Ethereal fallback)

Prerequisites
- Node.js 18+ recommended
- A Firebase service account JSON or set `GOOGLE_APPLICATION_CREDENTIALS` to point to the file

Quick start
1. Install dependencies

```bash
cd server
npm install
```

2. Create environment variables

Copy `.env.example` to `.env` and update values. At minimum set either `FIREBASE_SERVICE_ACCOUNT` (JSON string) or `GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json`.

3. Run the server

```bash
# dev
npm run dev
# production
npm start
```

Important notes
- Authentication: passwords are hashed with `bcrypt` and tokens are JWTs signed with `JWT_SECRET`.
- Logout is implemented by storing the currently-valid JWT in the user's Firestore document under `current_jwt`.
- To create an initial admin user automatically, set `INITIAL_ADMIN_EMAIL` to the admin email before registering.
- File uploads are stored locally in `server/uploads/`. You can change this to use Firebase Storage or another provider.

Security
- Use a strong `JWT_SECRET` in production and enable HTTPS in front of the server.
- Consider adding rate-limiting and CAPTCHA for registration/login endpoints.

Contact
If you need help wiring Firebase credentials or swapping uploads to Firebase Storage, tell me and I can implement it.
