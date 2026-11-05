-- Migration: Add position column to team_members
-- This allows team members to have specific positions/roles (e.g. Captain, Lead, Driver, Member)
-- displayed on the public website and managed via the admin panel.

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS position TEXT DEFAULT '';
