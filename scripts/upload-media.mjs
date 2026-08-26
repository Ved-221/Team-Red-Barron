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

const MEDIA_DIRS = [
  'public/media',
  'VEHICLE PHOTOS FOR WEBSITE',
  'TRB SPONSOR LOGO',
  'photos:vids'
];

async function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.mp4': return 'video/mp4';
    case '.webm': return 'video/webm';
    case '.mov': return 'video/quicktime';
    case '.glb': return 'model/gltf-binary';
    case '.gltf': return 'model/gltf+json';
    case '.avif': return 'image/avif';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

async function uploadFile(filePath, supabasePath) {
  const fileBody = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);

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
  console.log("Starting media upload...");
  let allFiles = [];
  for (const dir of MEDIA_DIRS) {
    allFiles = await getFiles(dir, allFiles);
  }

  // Filter only media files and ignore DS_Store, etc.
  const mediaFiles = allFiles.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.mp4', '.webm', '.mov', '.glb', '.gltf', '.avif', '.webp'].includes(ext);
  });

  console.log(`Found ${mediaFiles.length} media files to upload.`);

  for (const file of mediaFiles) {
    // Generate a clean Supabase path
    // Remove the base directory prefix
    let supabasePath = file;
    for (const dir of MEDIA_DIRS) {
      if (file.startsWith(dir)) {
        supabasePath = file.substring(dir.length + 1); // remove dir + '/'
        
        // Add a prefix based on where it came from to keep it organized
        if (dir === 'public/media') {
            // keep as is
        } else if (dir === 'VEHICLE PHOTOS FOR WEBSITE') {
            supabasePath = `vehicles/${supabasePath}`;
        } else if (dir === 'TRB SPONSOR LOGO') {
            supabasePath = `sponsors/${supabasePath}`;
        } else if (dir === 'photos:vids') {
            supabasePath = `photos_vids/${supabasePath}`;
        }
        break;
      }
    }
    
    // Replace backslashes with forward slashes for storage path
    supabasePath = supabasePath.replace(/\\/g, '/');

    console.log(`Uploading ${file} -> ${supabasePath}...`);
    await uploadFile(file, supabasePath);
  }

  console.log("Upload complete!");
}

run();
