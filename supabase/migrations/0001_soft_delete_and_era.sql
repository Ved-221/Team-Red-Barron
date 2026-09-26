-- Add era_label to vehicles
alter table vehicles add column if not exists era_label text not null default 'MODERN ERA';

-- Add soft delete columns to repeatable tables
alter table vehicles add column if not exists deleted_at timestamptz;
alter table vehicles add column if not exists deleted_batch_id uuid;

alter table vehicle_specs add column if not exists deleted_at timestamptz;
alter table vehicle_specs add column if not exists deleted_batch_id uuid;

alter table team_photos add column if not exists deleted_at timestamptz;
alter table team_photos add column if not exists deleted_batch_id uuid;

alter table team_years add column if not exists deleted_at timestamptz;
alter table team_years add column if not exists deleted_batch_id uuid;

alter table team_members add column if not exists deleted_at timestamptz;
alter table team_members add column if not exists deleted_batch_id uuid;

alter table gallery_images add column if not exists deleted_at timestamptz;
alter table gallery_images add column if not exists deleted_batch_id uuid;

alter table sponsor_tiers add column if not exists deleted_at timestamptz;
alter table sponsor_tiers add column if not exists deleted_batch_id uuid;

alter table sponsors add column if not exists deleted_at timestamptz;
alter table sponsors add column if not exists deleted_batch_id uuid;

-- Drop old RLS policies and recreate them using deleted_at
drop policy if exists "Public read access for vehicles" on vehicles;
create policy "Public read access for vehicles" on vehicles for select using (deleted_at is null);

drop policy if exists "Public read access for vehicle_specs" on vehicle_specs;
create policy "Public read access for vehicle_specs" on vehicle_specs for select using (deleted_at is null);

drop policy if exists "Public read access for team_photos" on team_photos;
create policy "Public read access for team_photos" on team_photos for select using (deleted_at is null);

drop policy if exists "Public read access for team_years" on team_years;
create policy "Public read access for team_years" on team_years for select using (deleted_at is null);

drop policy if exists "Public read access for team_members" on team_members;
create policy "Public read access for team_members" on team_members for select using (deleted_at is null);

drop policy if exists "Public read access for gallery_images" on gallery_images;
create policy "Public read access for gallery_images" on gallery_images for select using (deleted_at is null);

drop policy if exists "Public read access for sponsor_tiers" on sponsor_tiers;
create policy "Public read access for sponsor_tiers" on sponsor_tiers for select using (deleted_at is null);

drop policy if exists "Public read access for sponsors" on sponsors;
create policy "Public read access for sponsors" on sponsors for select using (deleted_at is null);

-- Optionally drop the old is_deleted column
alter table vehicles drop column if exists is_deleted;
alter table vehicle_specs drop column if exists is_deleted;
alter table team_photos drop column if exists is_deleted;
alter table team_years drop column if exists is_deleted;
alter table team_members drop column if exists is_deleted;
alter table gallery_images drop column if exists is_deleted;
alter table sponsor_tiers drop column if exists is_deleted;
alter table sponsors drop column if exists is_deleted;
