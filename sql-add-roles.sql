-- sql-add-roles.sql
-- Run this in Supabase SQL Editor → New query
-- Adds the role system to your existing profiles table

-- 1. Add the role column (defaults everyone to 'groupie')
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'groupie'
    CHECK (role IN ('groupie', 'member'));

-- 2. Drop the old open UPDATE policy and replace it with one
--    that prevents users from changing their own role
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (not role)"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

-- 3. Update the auto-create trigger to explicitly set role = 'groupie'
--    on new signups (the column default already handles this, but being explicit)
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

-- Done. To promote someone to member:
-- UPDATE public.profiles SET role = 'member' WHERE email = 'theiremail@gmail.com';
