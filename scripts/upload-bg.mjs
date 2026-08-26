import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadFile(filePath, supabasePath) {
  const fileBody = fs.readFileSync(filePath);

  console.log(`Uploading ${filePath} (${fileBody.length} bytes)...`);
  const { data, error } = await supabase.storage
    .from('trb-media')
    .upload(supabasePath, fileBody, {
      contentType: 'video/mp4',
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
  } else {
    console.log(`Successfully uploaded ${filePath} to ${supabasePath}`);
  }
}

uploadFile('trb_bg_optimized.mp4', 'trB_BG.mp4');
