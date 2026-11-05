-- Migration: Add sort_order and description to departments
-- This allows ordering domains in the admin panel and customizing domain descriptions shown on /team

ALTER TABLE departments ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Seed descriptions for standard known departments if empty
UPDATE departments SET description = 'Designing and optimizing the power delivery system to ensure maximum efficiency and performance on the track.', sort_order = 1 WHERE name = 'TRANSMISSION' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Developing safe, high-capacity, and high-discharge energy storage systems for our electric powertrain.', sort_order = 2 WHERE name = 'ACCUMULATOR' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Engineering the high-voltage electrical systems and motor controllers that provide our vehicle''s immense torque.', sort_order = 3 WHERE name = 'ELECTRIC POWERTRAIN' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Constructing the structural backbone of the race car, ensuring driver safety and maximizing torsional rigidity.', sort_order = 4 WHERE name = 'ROLLCAGE' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Fine-tuning suspension, steering, and aerodynamics to give our drivers complete control in every corner.', sort_order = 5 WHERE name = 'VEHICLE DYNAMICS' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Maximizing the efficiency and reliability of internal combustion components for extreme racing conditions.', sort_order = 6 WHERE name = 'MECHANICAL POWERTRAIN' AND (description IS NULL OR description = '');
UPDATE departments SET description = 'Operations, corporate outreach, media, logistics, and organizational excellence driving Team Red Baron.', sort_order = 7 WHERE name = 'MANAGEMENT' AND (description IS NULL OR description = '');

