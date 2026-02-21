-- sql-add-forum.sql
-- Run this in Supabase SQL Editor → New query
-- Creates the forum_posts table for the members-only forum chat

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    display_name TEXT,
    avatar_url   TEXT,
    content      TEXT        NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
    created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- 3. Everyone (including visitors) can read posts
CREATE POLICY "Anyone can view forum posts"
    ON public.forum_posts FOR SELECT
    USING (true);

-- 4. Only members can INSERT — and only as themselves
CREATE POLICY "Members can create posts"
    ON public.forum_posts FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'member'
    );

-- 5. Post owner can UPDATE (edit) their own posts
CREATE POLICY "Members can edit own posts"
    ON public.forum_posts FOR UPDATE
    USING  (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Post owner can DELETE their own posts
CREATE POLICY "Members can delete own posts"
    ON public.forum_posts FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Add table to Supabase real-time publication
--    (needed for live message delivery)
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;

-- 8. Performance indexes
CREATE INDEX IF NOT EXISTS forum_posts_created_at_idx ON public.forum_posts (created_at ASC);
CREATE INDEX IF NOT EXISTS forum_posts_user_id_idx    ON public.forum_posts (user_id);

-- Done.
-- To promote a user to member so they can post:
--   UPDATE public.profiles SET role = 'member' WHERE email = 'theiremail@gmail.com';
