-- 0003_photo_crop.sql
-- Adds crop/framing settings for the profile photo.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

alter table public.profile
  add column if not exists photo_zoom numeric(3,2) not null default 1
    check (photo_zoom between 1 and 3),
  add column if not exists photo_x smallint not null default 50
    check (photo_x between 0 and 100),
  add column if not exists photo_y smallint not null default 20
    check (photo_y between 0 and 100);
