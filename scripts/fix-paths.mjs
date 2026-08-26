import fs from 'fs';

const files = [
  'src/components/AboutTimeline.tsx',
  'src/components/LeadershipExperience.tsx',
  'src/components/SponsorsMarquee.tsx',
  'src/components/TRBEvolutionTimeline.tsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Fix AboutTimeline (missing images_timeline)
  c = c.replace(/\/trb-media\/\/(20\d\d\.(jpg|png|avif))/g, '/trb-media/images_timeline/$1');
  
  // Fix LeadershipExperience (missing team)
  c = c.replace(/\/trb-media\/\/(leader\d+\.jpg)/g, '/trb-media/team/$1');
  
  // Fix SponsorsMarquee (missing sponsors)
  c = c.replace(/\/trb-media\/\/(TITLE|PLATINUM|GOLD|SILVER)\//g, '/trb-media/sponsors/$1/');
  
  // Fix TRBEvolutionTimeline (missing buggyy.png)
  // Wait, buggyy.png didn't have a slash after it in the regex.
  // The original path was "/media/buggyy.png".
  // The regex matched `/media/buggyy.png` and replaced with `.../trb-media/$1`
  // Since bash expanded $1 to empty, it became `.../trb-media/`.
  // So we just replace `"/trb-media/"` that doesn't have anything after it, but be careful.
  c = c.replace(/"https:\/\/axzwucvnrjtenvvrxfew\.supabase\.co\/storage\/v1\/object\/public\/trb-media\/"/g, '"https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/buggyy.png"');
  
  fs.writeFileSync(f, c);
});

console.log("Fixed paths.");
