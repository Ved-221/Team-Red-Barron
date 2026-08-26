import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadFile(filePath, supabasePath, contentType) {
  const fileBody = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from('trb-media')
    .upload(supabasePath, fileBody, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
  } else {
    console.log(`Successfully uploaded ${filePath} to ${supabasePath}`);
  }
}

async function run() {
  await uploadFile('albratross.png', 'assets/images/albatros-xiii.png', 'image/png');
  await uploadFile('albatros-background-compressed.mp4', 'assets/videos/albatros-background.mp4', 'video/mp4');
}

run();
