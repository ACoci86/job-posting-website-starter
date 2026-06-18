# Job Board

A simple job posting website built with Next.js, where people can log in with their
GitHub account, browse jobs, and post jobs.

This README explains, in plain words, what each part of the project does — and shows
the code for the main files.

## Screenshot

![Sign-in page](docs/signin.png)

---

## The login system (the main work)

### `auth.ts` — the brain of logging in

It says "let people log in with their GitHub account," and decides what to remember
about them (their id and name). Everything else asks this file when it needs to deal
with logins.

```ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    // Remember who's logged in using a cookie in their browser,
    // so we don't have to check the database every time.
    strategy: "jwt",
  },
  providers: [GitHub],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    // When someone logs in, save their id and name onto their login pass
    // so we can remember who they are on later visits.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    // Take the id and name we saved and make them available to the rest
    // of the app, so pages know who the logged-in user is.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
```

### `lib/prisma.ts` — the phone line to your database

Any time the app needs to read or save info (like users), it goes through this file.
It's set up so the app doesn't accidentally open hundreds of database connections
while you're developing.

```ts
import { PrismaClient } from "../app/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
```

### `app/api/auth/[...nextauth]/route.ts` — the doorway the browser knocks on

When someone clicks "sign in," gets sent to GitHub, and comes back, all those
behind-the-scenes web requests land here. It just hooks up the ready-made login
machinery from `auth.ts`.

```ts
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

---

## The pages people see

### `app/auth/signin/page.tsx` — the sign-in screen

The "Welcome to JobList" screen with the "Continue with GitHub" button.

### `components/Navbar.tsx` — the top menu bar

Shown on every page: logo, links (Browse Jobs, Post a Job, Dashboard), and a
Sign In button.

### `app/jobs`, `app/jobs/post`, `app/dashb` — placeholder pages

The pages for Browse Jobs, Post a Job, and Dashboard. Right now they just show a
title — empty rooms waiting to be furnished. They exist so the menu links don't
hit a "page not found" error.

---

## The database design

### `prisma/schema.prisma` — the blueprint of your database

What info you store and how it's shaped (users, accounts, etc.). Running
`npx prisma generate` turns this blueprint into the code that `lib/prisma.ts` uses.

---

## In one sentence

GitHub login set up end-to-end — the screen people click, the doorway that handles
the login, the brain that decides the rules, and the database connection that
remembers who they are — plus empty pages ready for the actual job-board features.

---

## Running the project

```bash
npm install            # install dependencies
npx prisma generate    # build the database code from the blueprint
npm run dev            # start the app at http://localhost:3000
```

You'll need a `.env` file (not committed) with your database connection and GitHub
login keys.
