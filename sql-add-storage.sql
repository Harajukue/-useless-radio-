-- sql-add-storage.sql
-- Run this in Supabase SQL Editor → New query
-- Sets up the 'avatars' storage bucket for member profile pictures

-- 1. Create the public bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Anyone can view avatars (needed to display them on the site)
CREATE POLICY "Avatars are publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- 3. Only members can upload — and only to their own folder
CREATE POLICY "Members can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'member'
    );

-- 4. Members can overwrite/update their own avatar
CREATE POLICY "Members can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 5. Members can delete their own avatar
CREATE POLICY "Members can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
