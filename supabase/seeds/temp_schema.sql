-- Singletons -------------------------------------------------

create table site_settings (
  id int primary key default 1 check (id = 1),
  hero_tagline text not null,
  flagship_vehicle_id uuid, -- references vehicles(id) will be added later if needed
  updated_at timestamptz default now()
);

create table about_content (
  id int primary key default 1 check (id = 1),
  intro_headline text,
  intro_summary text,
  vision_text text,
  mission_text text,
  team_photo_url text,
  team_photo_caption text,
  updated_at timestamptz default now()
);

create table contact_info (
  id int primary key default 1 check (id = 1),
  email text,
  address text,
  instagram_url text,
  linkedin_url text,
  youtube_url text,
  twitter_url text,
  updated_at timestamptz default now()
);

-- Repeating content (with soft deletes) ----------------------

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  year text not null,               -- "2026"
  vehicle_name text not null,       -- "Albatros XIV"
  chassis_serial text,              -- only needed for the flagship
  subtitle text,
  rank_text text,
  badge_text text,
  icon_key text,
  description text,
  image_url text,
  status_badge text,                -- e.g. "RACE READY" (flagship only)
  background_video_url text,        -- flagship only
  timeline_order int not null,      -- explicit ordering
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- foreign key for site_settings flagship
alter table site_settings add constraint fk_flagship_vehicle 
  foreign key (flagship_vehicle_id) references vehicles(id);

create table vehicle_specs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null,
  is_deleted boolean default false
);

create table team_photos (   -- "OFF THE MAP"
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null,
  is_deleted boolean default false
);

create table team_years (
  id uuid primary key default gen_random_uuid(),
  year_label text not null unique,  -- "2025-26"
  sort_order int not null,
  is_deleted boolean default false
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_year_id uuid references team_years(id) on delete cascade,
  name text not null,
  role text not null,
  department text not null, -- Admin has all powers, no fixed check constraint
  image_url text,
  linkedin_url text,
  sort_order int not null,
  is_deleted boolean default false
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  category text,
  sort_order int not null,
  is_deleted boolean default false
);

create table sponsor_tiers (
  id uuid primary key default gen_random_uuid(),
  tier_name text not null,          -- "TITLE SPONSORS"
  sort_order int not null,
  is_deleted boolean default false
);

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  tier_id uuid references sponsor_tiers(id) on delete cascade,
  name text not null,
  logo_url text not null,
  website_url text,
  sort_order int not null,
  is_deleted boolean default false
);

-- RLS Policies for Storage
-- Note: Assuming storage extension is installed, which is true for Supabase projects.
-- Ensure RLS is active on the tables
alter table site_settings enable row level security;
alter table about_content enable row level security;
alter table contact_info enable row level security;
alter table vehicles enable row level security;
alter table vehicle_specs enable row level security;
alter table team_photos enable row level security;
alter table team_years enable row level security;
alter table team_members enable row level security;
alter table gallery_images enable row level security;
alter table sponsor_tiers enable row level security;
alter table sponsors enable row level security;

-- Public can read (only non-deleted for repeatable tables)
create policy "Public read access for site_settings" on site_settings for select using (true);
create policy "Public read access for about_content" on about_content for select using (true);
create policy "Public read access for contact_info" on contact_info for select using (true);

create policy "Public read access for vehicles" on vehicles for select using (is_deleted = false);
create policy "Public read access for vehicle_specs" on vehicle_specs for select using (is_deleted = false);
create policy "Public read access for team_photos" on team_photos for select using (is_deleted = false);
create policy "Public read access for team_years" on team_years for select using (is_deleted = false);
create policy "Public read access for team_members" on team_members for select using (is_deleted = false);
create policy "Public read access for gallery_images" on gallery_images for select using (is_deleted = false);
create policy "Public read access for sponsor_tiers" on sponsor_tiers for select using (is_deleted = false);
create policy "Public read access for sponsors" on sponsors for select using (is_deleted = false);

-- Authenticated users have all permissions (CRUD)
create policy "Admin all access for site_settings" on site_settings to authenticated using (true) with check (true);
create policy "Admin all access for about_content" on about_content to authenticated using (true) with check (true);
create policy "Admin all access for contact_info" on contact_info to authenticated using (true) with check (true);

create policy "Admin all access for vehicles" on vehicles to authenticated using (true) with check (true);
create policy "Admin all access for vehicle_specs" on vehicle_specs to authenticated using (true) with check (true);
create policy "Admin all access for team_photos" on team_photos to authenticated using (true) with check (true);
create policy "Admin all access for team_years" on team_years to authenticated using (true) with check (true);
create policy "Admin all access for team_members" on team_members to authenticated using (true) with check (true);
create policy "Admin all access for gallery_images" on gallery_images to authenticated using (true) with check (true);
create policy "Admin all access for sponsor_tiers" on sponsor_tiers to authenticated using (true) with check (true);
create policy "Admin all access for sponsors" on sponsors to authenticated using (true) with check (true);
