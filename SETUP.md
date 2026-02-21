# Useless.Radio v2 — Auth Setup Guide

Follow these steps once to wire up Google sign-in via Supabase.

---

## Step 1 — Create a Supabase Project

1. Go to https://supabase.com and sign up / log in.
2. Click **New Project**, fill in a name and database password, choose a region.
3. Wait ~1 min for provisioning.
4. Go to **Settings → API** and copy:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long JWT string)

---

## Step 2 — Set up Google OAuth Credentials

1. Go to https://console.cloud.google.com.
2. Create a project (or use an existing one).
3. **APIs & Services → OAuth consent screen** — choose External, fill in app name + emails, add scopes `email`, `profile`, `openid`.
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URI:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
5. Copy the **Client ID** and **Client Secret**.

---

## Step 3 — Enable Google Provider in Supabase

1. **Authentication → Providers → Google** — toggle on.
2. Paste the Client ID and Client Secret from Step 2.
3. Save.

---

## Step 4 — Configure Redirect URLs in Supabase

1. **Authentication → URL Configuration**
2. **Site URL**: your production domain, e.g. `https://yourdomain.com`
3. **Redirect URLs** — add every URL the app might land on after login:
   ```
   https://yourdomain.com/
   https://yourdomain.com/uselessradio-v2/
   http://localhost:5500/
   http://127.0.0.1:5500/
   ```

---

## Step 5 — Fill in `supabase-config.js`

Open `uselessradio-v2/supabase-config.js` and replace the placeholders:

```js
const SUPABASE_URL      = 'https://xxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...';
```

---

## Step 6 — Run the SQL in Supabase

**SQL Editor → New query** — paste and run:

```sql
-- Profiles table
-- role: 'groupie' (default, fan/visitor) | 'member' (collective member)
-- Groupies: view-only forum, no profile pic
-- Members:  can post in forum, can set profile pic
CREATE TABLE IF NOT EXISTS public.profiles (
    id           UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    email        TEXT,
    avatar_url   TEXT,
    bio          TEXT,
    role         TEXT        NOT NULL DEFAULT 'groupie'
                             CHECK (role IN ('groupie', 'member')),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own row BUT cannot change their role
-- (role changes must be done manually via the Supabase dashboard or SQL)
CREATE POLICY "Users can update own profile (not role)"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- Auto-create profile row (as 'groupie') on first sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, email, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.email,
        NEW.raw_user_meta_data ->> 'avatar_url',
        'groupie'
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep updated_at current on edits
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---
    
## Done

- **Desktop**: click the `👤` icon in the taskbar (left of 🔊 📶 🔋) to sign in.
- **Mobile**: open the Start menu → tap **Sign In** above Settings.
- After signing in, **"User"** in the Start menu header becomes the Google display name.
- **Settings** (⚙️) or the signed-in `👤` icon opens the profile modal to edit display name and bio.

---

## Promoting a Groupie to Member

Everyone who signs in starts as a **groupie**. To promote someone to **member**:

1. Go to your Supabase dashboard → **Table Editor → profiles**
2. Find the person's row (search by email or display_name)
3. Click the `role` cell and change it from `groupie` → `member`
4. Save

Or run this in **SQL Editor**:

```sql
UPDATE public.profiles
SET role = 'member'
WHERE email = 'theiremail@gmail.com';
```

Members immediately get:
- Profile picture field in Settings
- Forum posting access (once forum is built)
- `[member]` badge in the Start menu header
- Their avatar shown in the Start menu header

---

## Future: Forum

Yes — a forum is doable with Supabase. Basic extra tables:

```sql
CREATE TABLE posts (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE replies (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id    UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id  UUID REFERENCES profiles(id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Posts viewable by all"   ON posts   FOR SELECT USING (true);
CREATE POLICY "Replies viewable by all" ON replies FOR SELECT USING (true);

-- Only members can post/reply (groupies are read-only)
CREATE POLICY "Members can post" ON posts FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'member'
    );
CREATE POLICY "Members can reply" ON replies FOR INSERT
    WITH CHECK (
        auth.uid() = author_id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'member'
    );
```

The Forum item already exists in the Start menu (`data-app="forum"`) and just needs a window wired to it.
