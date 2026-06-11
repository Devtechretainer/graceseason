# Supabase Auth Setup — Akaal Clothing

Your signup/login now uses **Supabase**, a real database + auth service. Once you
finish these steps, every person who signs up is permanently saved and you can
see their details any time in the Supabase dashboard.

Total time: ~10 minutes. No coding required — just clicking and copy/paste.

---

## 1. Create a free Supabase project

1. Go to **https://supabase.com** and click **Start your project** (sign in with GitHub or email).
2. Click **New project**.
3. Fill in:
   - **Name:** `akaal-clothing` (anything is fine)
   - **Database Password:** click *Generate a password* and **save it somewhere safe**.
   - **Region:** pick the one closest to your customers (e.g. *West EU* or *US East*).
4. Click **Create new project** and wait ~2 minutes while it sets up.

---

## 2. Copy your two keys into the project

1. In the Supabase dashboard, open **Project Settings** (gear icon) → **API**.
2. You'll see:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **Project API keys → `anon` `public`** (a long string)
3. Open the file **`.env.local`** in this project and replace the placeholders:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...the-long-anon-key...
   ```

4. Save the file.

> The `anon public` key is meant to be public — it's safe in the browser.
> Never paste the `service_role` / secret key here.

---

## 3. Make the verification email send a 6-digit CODE (not a link)

By default Supabase emails a clickable link. Your site uses a 6-digit code, so
we switch the template to send the code instead.

1. In the dashboard go to **Authentication** → **Emails** → **Templates**.
2. Select the **Confirm signup** template.
3. Replace the whole message body with this:

   ```html
   <h2>Confirm your Akaal Clothing account</h2>
   <p>Enter this code to verify your email address:</p>
   <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">{{ .Token }}</p>
   <p>This code expires in 1 hour.</p>
   ```

   The important part is **`{{ .Token }}`** — that is the 6-digit code.
4. Click **Save**.

(Do the same for the **Reset password** template later if you want password
resets to work — that one is optional for now.)

---

## 4. (Optional) Confirm email verification is ON

Go to **Authentication** → **Sign In / Providers** → **Email** and make sure
**"Confirm email"** is enabled (it is by default). This is what forces new users
to enter the code before they can log in.

---

## 5. Restart the dev server

Environment variables are only read at startup, so after editing `.env.local`:

```
# stop the running dev server (Ctrl+C), then:
npm run dev
```

---

## ✅ How to see who signed up (your original question)

In the Supabase dashboard:

- **Authentication → Users** — every registered person, their email, signup date,
  and whether they verified.
- Click any user to see the **User Metadata** — their **first name, last name,
  and phone number** are stored there.

That's the permanent record you were missing before.

---

## Going live (Vercel)

When you deploy, add the same two variables in **Vercel → your project →
Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then in Supabase, go to **Authentication → URL Configuration** and add your live
site URL (e.g. `https://akaalclothing.com`) to the **Site URL** / **Redirect URLs**.

---

## Note on Supabase's free email limit

Supabase's built-in email is rate-limited (a handful per hour) — fine for testing.
For a real store, connect a custom SMTP provider (e.g. Resend, SendGrid, or your
own domain email) under **Authentication → Emails → SMTP Settings**. Ask me and I
can walk you through it.
