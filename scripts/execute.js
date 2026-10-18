import { createClient } from '@supabase/supabase-js';
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const fs = require('fs');
async function run() {
  const sql = fs.readFileSync('supabase/migrations/0000_initial_schema.sql', 'utf8');
  console.log('SQL read');
}
run();

