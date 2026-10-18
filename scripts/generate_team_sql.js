const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('Team_Red_Baron_Roster.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

let sql = '';
const teamYearId = '46599412-8b71-4832-b048-7d4843524d27'; // 2025-26
const helmetImage = 'https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png';

let sortOrder = 0;

for (const row of data) {
  if (row.Name.includes('HOW TO FILL') || row.Name.includes('Shaded') || row.Name.includes('Team Year') || row.Name.includes('Example row') || row.Name.includes('Names come from')) {
    continue;
  }

  const name = row.Name.replace(/'/g, "''");
  
  // Find photo in public/team that matches the name
  // The script will just look for the file that starts with the name, but since filenames were used to generate names, let's just find the filename in public/team
  // Actually, wait, the names in Excel are derived from the filenames, e.g. "Aaditya Deshpande Thirdyear" from "Aaditya_Deshpande_Thirdyear.jpg".
  // Let's list files in public/team and map.
  let photoUrl = helmetImage;
  const files = fs.readdirSync('public/team');
  const matchedFile = files.find(f => {
    const nameWithoutExt = f.substring(0, f.lastIndexOf('.')).replace(/_/g, ' ');
    return nameWithoutExt.toLowerCase() === row.Name.toLowerCase();
  });
  
  if (matchedFile) {
    photoUrl = `/team/${matchedFile}`;
  }
  
  const role = row.Designation ? row.Designation.replace(/'/g, "''") : "";
  const department = row.Domain ? row.Domain.replace(/'/g, "''") : "";
  const linkedin = row.LinkedIn ? row.LinkedIn.replace(/'/g, "''") : "";

  sql += `INSERT INTO team_members (id, team_year_id, name, role, department, image_url, linkedin_url, sort_order) VALUES (gen_random_uuid(), '${teamYearId}', '${name}', '${role}', '${department}', '${photoUrl}', '${linkedin}', ${sortOrder});\n`;
  sortOrder++;
}

fs.writeFileSync('seed_team.sql', sql);
console.log('SQL generated!');
