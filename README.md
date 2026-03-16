# Kala Vriksha — Next.js

Converted from PHP/HTML to **Next.js 14** (Pages Router).

## Project Structure

```
kala-vriksha-next/
├── data/                   ← JSON "database" (persisted server-side)
│   ├── users.json
│   ├── events.json
│   ├── registrations.json
│   └── interactions.json
├── lib/
│   ├── data.js             ← read/write JSON files (replaces PHP file I/O)
│   └── session.js          ← cookie-based sessions (replaces PHP $_SESSION)
├── pages/
│   ├── _app.js             ← global layout, Bootstrap, fonts
│   ├── index.js            ← landing page (SSR)
│   ├── login.js            ← login + register + forgot password
│   ├── dashboard.js        ← user dashboard
│   ├── admin.js            ← admin panel
│   └── api/
│       ├── auth.js         ← POST login / register / forgot_password
│       ├── logout.js       ← POST clears cookie
│       ├── me.js           ← GET current session
│       ├── events.js       ← GET all | POST add/delete
│       ├── contact.js      ← GET (admin) | POST save message
│       └── registrations.js← GET | POST upload proof / verify
├── components/
│   ├── ParticleBackground.js
│   └── useReveal.js
├── public/                 ← all images (logo, founders, QR code, etc.)
├── styles/
│   ├── globals.css
│   └── style.css           ← original CSS merged + Next.js fixes
└── package.json
```

## Quick Start

```bash
cd kala-vriksha-next
npm install
npm run dev
```

Open **http://localhost:3000**

## Default Credentials

| Role  | Username     | Password    |
|-------|--------------|-------------|
| Admin | ashish_sony  | vriksha2026 |
| Admin | anurag_sony  | vriksha2026 |

> **Note:** The user `sp` (Manoj Sp) had a PHP bcrypt password that cannot be
> verified in Node.js. They must use **Forgot Password** to set a new one.
> DOB: 2003-08-19 | Email: manojspyadav@gmail.com

## Deploying

### Vercel (recommended — free)
```bash
npm install -g vercel
vercel
```

### Self-hosted
```bash
npm run build
npm start
```

> **Important for deployment:** The `data/` folder must be writable.
> On Vercel, use a database (e.g., Vercel KV or PlanetScale) instead of
> file-based storage since the filesystem is read-only. For local/VPS hosting,
> file-based storage works perfectly.

## PHP → Next.js Mapping

| PHP                        | Next.js                          |
|----------------------------|----------------------------------|
| `$_SESSION`                | HTTP-only cookie (`lib/session.js`) |
| `file_get_contents(*.json)`| `readData()` in `lib/data.js`    |
| `file_put_contents(*.json)`| `writeData()` in `lib/data.js`   |
| `auth.php`                 | `pages/api/auth.js`              |
| `upload_payment.php`       | `pages/api/registrations.js`     |
| `contact.php`              | `pages/api/contact.js`           |
| PHP page routing           | Next.js pages router             |
| `header("Location: ...")`  | `router.push()` / `redirect`     |
