-- 0004_project_images.sql
-- Lets a project have up to 5 pictures, each with its own framing.
-- The first picture is the one shown on the project card.
-- Run in Supabase: SQL Editor -> New query -> paste -> Run.

alter table public.projects
  add column if not exists images jsonb not null default '[]'::jsonb
    check (jsonb_typeof(images) = 'array' and jsonb_array_length(images) <= 5);

-- Carry over the existing single image of each project.
update public.projects
set images = jsonb_build_array(
  jsonb_build_object('path', image_path, 'zoom', 1, 'x', 50, 'y', 50)
)
where image_path is not null and images = '[]'::jsonb;
