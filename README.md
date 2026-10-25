# Elisha Mlay: terminal portfolio

A portfolio site that behaves like a terminal. Built with Next.js (App Router), React and TypeScript. No UI library, no Tailwind, fonts are self-hosted through Fontsource.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Needs Node 20 or newer. Open the site at `http://localhost:3000`. To test on a phone on the same Wi-Fi, put your computer's address in `allowedDevOrigins` in `next.config.mjs`.

## Edit your content

Everything you would change lives in `lib/content.ts`: profile, contact links, projects, skills, experience and education. Add a project by adding one object to `PROJECTS`; it appears in `projects`, `open <id>`, `ls projects`, `tree` and tab completion automatically.

To add GitHub, add an entry to `CONTACT.links`:

```ts
{ label: "github", text: "github.com/your-handle", url: "https://github.com/your-handle" }
```

## Commands

`help`, `about`, `experience`, `education`, `projects`, `demo [seed]`, `open <id>`, `skills`, `resume`, `contact`, `contact --send`, `neofetch`, `banner`, `ls`, `cd`, `cat`, `pwd`, `tree`, `echo`, `date`, `history`, `theme`, `clear`, `sudo hire-me`

Keys: Tab completes, Up and Down recall history, Ctrl+L clears, Ctrl+C cancels the line or the message form, Ctrl+U clears the line.

## CV download

`resume` links to `public/Elisha_Bariki_Mlay_CV.pdf`. That copy has the referees section removed and says "Referees available on request." To update it, replace the file and keep the same name. Remove any third-party phone numbers before you put a new CV in `public/`, because everything in that folder is public.

## Contact form (`contact --send`)

The form asks for name, email and message in the terminal, then posts to `app/api/contact/route.ts`, which sends the email through Resend. Without a key the site still works: the form tells the visitor messaging is not set up and shows your email address.

1. Create a free account at https://resend.com and make an API key.
2. Locally, copy `.env.example` to `.env.local` and fill in `RESEND_API_KEY`.
3. On Vercel, add the same variables under Project, Settings, Environment Variables, then redeploy.

Resend's free test sender (`onboarding@resend.dev`) only delivers to the email you signed up to Resend with. To receive messages at another address, or to send from your own domain, verify a domain in Resend and set `CONTACT_FROM`.

The route validates input, caps lengths, and allows 3 messages per 10 minutes per IP. That limit lives in server memory, so on serverless hosting it slows casual abuse but is not a hard guarantee.

## Social preview image

`app/opengraph-image.tsx` draws the 1200x630 card shown when the link is shared on WhatsApp, LinkedIn and X. Set `NEXT_PUBLIC_SITE_URL` to your real address so the preview URL is correct. After deploying, you can check it with LinkedIn's Post Inspector.

## Analytics

`@vercel/analytics` is included and only reports when the site runs on Vercel. Turn it on under Project, Analytics in the Vercel dashboard. Remove `<Analytics />` from `app/layout.tsx` if you do not want it.

## Project layout

```
app/                    layout, page, styles, favicon, preview image
app/api/contact/        contact form endpoint
components/Terminal.tsx input, history, completion, message form, scrollback
lib/content.ts          all text and links
lib/fs.tsx              virtual file system behind ls, cd, cat, tree
lib/commands.tsx        command registry
lib/views.tsx           the output components
lib/demo.ts             sample-data engine for the demo command
lib/DemoView.tsx        animated output for the demo command
public/                 CV PDF
```

## Deploy

**Vercel (simplest):** push this folder to a GitHub repo, import it at vercel.com, add the environment variables from `.env.example`, and deploy. Add your domain under Project, Settings, Domains.

**Anywhere else:** run `npm run build` and `npm start` on a Node host, with the same environment variables set.

## Notes

- The page works at phone width. On touch screens the dock at the bottom runs commands with one tap.
- Light and dark themes follow the system setting. `theme` or the button in the top bar overrides it and remembers the choice.
- Content is also rendered as plain text for search engines and screen readers.
- The `demo` command uses generated sample data and an illustrative tariff, not any real bank's data.
