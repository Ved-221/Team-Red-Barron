-- Migration: Add home_achievements table for homepage stats ticker cards
CREATE TABLE IF NOT EXISTS home_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Trophy',
  detail TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access
ALTER TABLE home_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for home_achievements" ON home_achievements;
CREATE POLICY "Public read access for home_achievements" ON home_achievements FOR SELECT USING (deleted_at IS NULL);

-- Seed initial achievements if table is empty
INSERT INTO home_achievements (label, value, icon, detail, sort_order)
SELECT * FROM (VALUES
  ('Years of Legacy', '15 YEARS', 'History', 'Active 2011 – Present', 1),
  ('Vehicles Built', '14 ATVs', 'Car', 'Albatros 1.0 to XIV', 2),
  ('E-BAJA INDIA 2025', '1ST RANK', 'ShieldCheck', 'Overall Statics', 3),
  ('E-BAJA INDIA 2024', 'AIR 1', 'Trophy', 'Engineering Design', 4),
  ('E-BAJA INDIA 2024', 'AIR 2', 'Award', 'Overall National Rank', 5),
  ('E-BAJA INDIA', 'BEST 4WD', 'Zap', 'Performance Award', 6),
  ('Baja SAE Illinois 2017', '9TH RANK', 'Car', 'Overall Dynamics (USA)', 7),
  ('Baja SAE Rochester 2019', '7TH RANK', 'History', 'Hill Climbing (USA)', 8)
) AS v(label, value, icon, detail, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM home_achievements);
