# EYEBREED preorder waitlist

Minimal Next.js app for preorder signups and email broadcasts. It uses the same PostgreSQL database as the main EYEBREED app, but stores signups in `PreorderWaitlistEntry`.

## Setup

1. Copy `.env.example` to `.env` and fill in the database, admin password, and Resend values.
2. Run `npm install`.
3. The preorder table has already been created in the shared database. For a different fresh database, run `npm run db:setup` once.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Open `/admin` to send an email to everyone on the preorder list.

Create the email API key at Resend and verify the domain used by `MAIL_FROM`.
