import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import fs from 'fs';

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://axzwucvnrjtenvvrxfew.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const workbook = xlsx.readFile('Team_Red_Baron_Roster.xlsx');
  
  // Collect all members from all sheets
  const excelMembers = [];
  for (const sheet of workbook.SheetNames) {
    if (sheet === 'Team Roster') continue; // Skip template
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet], { defval: '' });
    for (const row of data) {
      if (row.Name && row.Name.trim() !== '') {
        excelMembers.push({
          name: row.Name.trim().toLowerCase(),
          linkedin: row.LinkedIn ? row.LinkedIn.trim() : null,
          role: row.Designation ? row.Designation.trim() : null,
          domain: row.Domain ? row.Domain.trim() : null,
        });
      }
    }
  }

  // Fetch current members from Supabase
  const { data: dbMembers, error } = await supabase.from('team_members').select('id, name');
  if (error) {
    console.error("Error fetching db members:", error);
    return;
  }

  let updatedCount = 0;

  for (const dbMember of dbMembers) {
    const dbNameLower = dbMember.name.toLowerCase();
    
    // Find a match in excel
    // Since dbName has "Thirdyear" appended, we check if dbName includes the excel name
    let match = null;
    for (const em of excelMembers) {
      // Split excel name into parts (e.g., "Aaditya Deshpande")
      const parts = em.name.split(/\s+/).filter(p => p.length > 0);
      if (parts.length >= 2) {
        // Must contain both first and last name
        if (dbNameLower.includes(parts[0]) && dbNameLower.includes(parts[parts.length - 1])) {
          match = em;
          break;
        }
      } else if (parts.length === 1) {
        if (dbNameLower.includes(parts[0])) {
          match = em;
          break;
        }
      }
    }

    if (match && match.linkedin) {
      console.log(`Matching: ${dbMember.name} -> ${match.linkedin}`);
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ 
          linkedin_url: match.linkedin,
          ...(match.role ? { role: match.role } : {})
        })
        .eq('id', dbMember.id);
        
      if (updateError) {
        console.error("Error updating:", updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`Updated ${updatedCount} members successfully.`);
}

main();
