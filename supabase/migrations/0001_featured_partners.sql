create table featured_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier_label text not null,
  logo_url text not null,
  background_image_url text not null,
  description text not null,
  contribution text not null,
  website_url text not null,
  sort_order int not null,
  is_deleted boolean default false
);
alter table featured_partners enable row level security;
create policy "Public read access for featured_partners" on featured_partners for select using (is_deleted = false);
create policy "Admin all access for featured_partners" on featured_partners to authenticated using (true) with check (true);
