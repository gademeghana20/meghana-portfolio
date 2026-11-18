# Gade Meghana | Portfolio

A personal portfolio website with a private admin dashboard, so all content (about, experience, projects, resume and more) can be edited from the browser with no code changes.

- **Live site:** https://meghana-portfolio-rouge.vercel.app
- **Admin login:** https://meghana-portfolio-rouge.vercel.app/admin
- **Repository:** https://github.com/gademeghana20/meghana-portfolio

---

## 1. What is in this project

Two connected parts:

1. **Public portfolio** – Home, About, Skills, Experience, Education, Projects (with a detail page per project), Certifications, Contact and Footer. Responsive, light/dark theme, SEO metadata, sitemap and link-preview image.
2. **Private admin dashboard** (`/admin`) – log in and manage every section. Changes are saved to a database and appear on the public site without a new deployment.

## 2. Technology stack

| Part | Technology | Why |
|---|---|---|
| Website | Next.js 16, React 19, TypeScript | Fast pages, server-side security, one codebase for site and admin |
| Styling | Tailwind CSS 4 | Consistent design with light/dark themes |
| Database | Supabase (PostgreSQL) | Stores all content, with Row Level Security |
| Login | Supabase Auth | Email + password, public sign-up turned off |
| Files | Supabase Storage | Resume PDF, project pictures, profile photo, certificates |
| Validation | Zod | Checks every form on the server |
| Hosting | Vercel | Free tier, automatic deploys from GitHub |

## 3. Folder structure

```
meghana-portfolio/
├── supabase/migrations/     Database setup, run in order (0001 … 0004)
├── src/
│   ├── app/                 Pages and routes
│   │   ├── page.tsx           Public home page
│   │   ├── projects/[slug]/   Public project detail pages
│   │   ├── admin/             Admin login + dashboard pages
│   │   ├── sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg
│   ├── components/          Public UI (layout, sections, projects, ui)
│   ├── features/            Admin code
│   │   ├── auth/              Login, logout, admin check
│   │   ├── dashboard/         Sidebar and page header
│   │   └── portfolio-management/  One folder per editable section
│   ├── lib/
│   │   ├── supabase/          Database clients (public + logged-in)
│   │   ├── content/           Loads published content for the public site
│   │   ├── validation/        Form rules
│   │   └── utilities/
│   ├── types/               Shared TypeScript types
│   └── proxy.ts             Redirects logged-out visitors away from /admin
├── .env.example             Names of the settings needed (no real values)
└── README.md
```

## 4. How security works (in plain words)

- **Only you can edit.** After logging in, the database checks that your account is on a private allow-list (`admin_users`). Anyone else, even if logged in, is refused.
- **Visitors only see published content.** Database rules (Row Level Security) let the public read only items marked as published. Drafts stay hidden.
- **No secret keys in the code or browser.** The site uses only the *public* Supabase key. The powerful `service_role` / secret key is never used.
- **Sign-up is off**, so nobody can create an account.
- **Server-side checks.** Every admin page and every save re-checks that you are the admin, and all form input is validated.
- Never commit `.env.local` or paste keys in chat, issues or screenshots.

## 5. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Name | What it is | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project address | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The **public (publishable)** key | Supabase → Project Settings → API Keys |
| `NEXT_PUBLIC_SITE_URL` | Where the site lives (`http://localhost:3000` locally, your real address in production) | You decide |

`NEXT_PUBLIC_SITE_URL` is used for the sitemap, `robots.txt` and link previews. It is baked in at build time, so after changing it on Vercel you must **redeploy**.

## 6. Run it on your computer

Requirements: Node.js 20+ and Git.

```bash
git clone https://github.com/gademeghana20/meghana-portfolio.git
cd meghana-portfolio
npm install
cp .env.example .env.local     # then fill in the three values
npm run dev
```

Open http://localhost:3000. Other commands: `npm run lint`, `npm run build`, `npm run start`.

## 7. Set up the database (first time only)

1. Create a free project at supabase.com.
2. Open **SQL Editor → New query**, paste each file from `supabase/migrations/` **in order**, and click Run:
   1. `0001_schema.sql` – tables, security rules, storage buckets
   2. `0002_seed.sql` – starting content
   3. `0003_photo_crop.sql` – profile photo framing
   4. `0004_project_images.sql` – up to 5 pictures per project
3. **Authentication → Providers → Email:** turn **off** "Allow new users to sign up".

## 8. Create your admin account (first time only)

1. Supabase → **Authentication → Users → Add user → Create new user**. Enter your email and a strong password (tick "Auto confirm user").
2. Copy that user's **UID** from the Users list.
3. In **SQL Editor**, run (replace the placeholder with your UID):

   ```sql
   insert into public.admin_users (user_id) values ('PASTE-YOUR-UID-HERE');
   ```

4. Go to `/admin` and log in. Do not share the password with anyone, including AI assistants.

## 9. Deploy (Vercel)

1. Sign in at vercel.com with the GitHub account that owns the repo.
2. **Add New → Project →** import `meghana-portfolio`.
3. Under **Environment Variables**, add the three variables from section 5.
4. Click **Deploy**. Every later push to `main` deploys automatically.
5. In Supabase → **Authentication → URL Configuration**, set **Site URL** to your live address and add `https://YOUR-ADDRESS/**` and `http://localhost:3000/**` under **Redirect URLs**.
6. Check the live site, then log in at `/admin` and try a small edit.

## 10. Everyday use: updating your content

Log in at `/admin`, pick a section in the sidebar, edit, and save. No code or redeploy needed.

- **About Me** – designation, headline, introduction, summary, career interests, profile photo (zoom and drag to frame it).
- **Experience / Education / Certifications** – Add, Edit, Delete, reorder with the arrows, and hide or show with Publish / Unpublish.
- **Skills** – group technologies into categories.
- **Projects** – add title, descriptions, features, tech stack, GitHub and live links, status, and up to **5 pictures**. The first picture is shown on the project card; all of them appear on "View details". Each picture can be zoomed and moved.
- **Resume** – upload a new PDF; the public Download Resume button always points to the latest one.
- **Social Links** – add a link for any platform, reorder or hide links.
- **Contact** – the public email address.

**Drafts vs published:** "Save as draft" keeps an item hidden from the public site. "Save & publish" makes it live within moments. Deleting always asks for confirmation, and leaving a form with unsaved changes shows a warning.

## 11. Troubleshooting

| Problem | What to try |
|---|---|
| Can't log in | Check email and password. Confirm your UID is in `admin_users` (section 8). Wrong credentials always show a generic message on purpose. |
| Saving a section fails | A database migration may not have been run. Run any missing file from `supabase/migrations/` in the Supabase SQL Editor. |
| Edit saved but the public site is unchanged | Wait a few seconds and refresh. Confirm the item is **published**, not a draft. |
| Link previews or sitemap show the wrong address | Fix `NEXT_PUBLIC_SITE_URL` on Vercel, then **Redeploy**. |
| Build fails on Vercel | Open the failed deployment's log. Most often a variable name is misspelled. |
| `npm run dev` fails with certificate errors on a company network | The network may intercept HTTPS. Use a personal network, or point Node at your company's root certificate with `NODE_EXTRA_CA_CERTS`. Do not turn off certificate checking. |
| A page shows stale content after a code change locally | Stop the dev server, delete the `.next` folder, and start again. |
| Pictures or the resume won't upload | Pictures must be PNG, JPG or WebP up to 4 MB; the resume must be a real PDF up to 5 MB. |

## 12. Privacy and content rules

This repository is public. Never commit keys, passwords, `.env.local`, or confidential employer information such as internal application names, source code, customer or database details. Keep portfolio text to general technologies and your own contributions.
