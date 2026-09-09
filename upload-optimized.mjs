import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const filePath = '/Users/veddhapodkar/Documents/REPO/Team-Red-Barron/trb_bg_optimized.mp4';
const supabasePath = 'assets/videos/trb_bg_optimized.mp4';

async function run() {
  const fileBody = fs.readFileSync(filePath);
  console.log('Uploading optimized video...');
  const { data, error } = await supabase.storage
    .from('trb-media')
    .upload(supabasePath, fileBody, {
      contentType: 'video/mp4',
      upsert: true,
    });

  if (error) {
    console.error('Error uploading:', error.message);
  } else {
    console.log('Successfully uploaded to', supabasePath);
    console.log('URL:', `${supabaseUrl}/storage/v1/object/public/trb-media/${supabasePath}`);
  }
}

run();
