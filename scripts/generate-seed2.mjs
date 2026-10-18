import fs from 'fs';

const escapeString = (str) => {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
};

let sql = '';

const gallery = [
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/9P3A5963.JPG", title: "Albatross Baja Vehicle Field Test", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/9P3A7208.JPG", title: "High-Chroma Endurance Rally", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/DSC09637.JPG", title: "Chassis Precision & TIG Welds", category: "Chassis & Frame" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/DSCN0816.JPG", title: "Steering & Ergonomic Controls", category: "Telemetry & Cockpit" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/DSC00220.jpg", title: "All-Terrain Offroad Prototype", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/DSC_5688.jpeg", title: "Dynamic Double-A Arm Suspension", category: "Suspension & Wheels" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG-20250812-WA0006.jpg", title: "Night Pit Scrutineering & Check", category: "Telemetry & Cockpit" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG20260111194040.jpg", title: "High-Speed Sand Dune Sprint", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_0292.jpg", title: "Custom Tuned CVT Powertrain", category: "Powertrain" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_0497.JPG", title: "Endurance Championship Vehicle", category: "Chassis & Frame" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_20240816_090641.jpg", title: "Air Dam & Shock Telemetry", category: "Suspension & Wheels" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_5855.JPG", title: "All-Terrain Mud & Obstacle Run", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_5888.JPG", title: "Cockpit Dashboard & Brake Bias", category: "Telemetry & Cockpit" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_6603.JPG", title: "High-G Cornering Dynamics", category: "Testing & Track" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_6840.jpg", title: "Chassis Tubing Structural Audit", category: "Chassis & Frame" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/IMG_9384.JPG", title: "All-Terrain Offroad Wheel Assembly", category: "Suspension & Wheels" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/TRB_2.JPG", title: "Team Red Baron Motorsport Prototype", category: "Chassis & Frame" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/WBD09944.JPG", title: "Sensor Calibration & Telemetry", category: "Telemetry & Cockpit" },
  { img: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/gallery/20230405_171839.jpg", title: "BAJA National Championship Sprint", category: "Testing & Track" }
];

sql += `\n-- Gallery\n`;
gallery.forEach((g, idx) => {
  sql += `INSERT INTO gallery_images (image_url, title, category, sort_order) VALUES (${escapeString(g.img)}, ${escapeString(g.title)}, ${escapeString(g.category)}, ${idx});\n`;
});

const teamData = {
  "2025-26": [
    { name: "Untitled", role: "Captain", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "CFO & COO", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Mechanical CTO", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Electrical CTO", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Suspension Lead", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Brakes & Steering Lead", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Vehicle Dynamics Member", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Jr. Vehicle Dynamics Member", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "High Voltage Lead", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Low Voltage Lead", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "B-Plan Lead & High Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Jr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Jr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Jr. Low Voltage Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Chassis Lead", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Aerodynamics Lead", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Structures Member", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Structures Member", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Structures Member", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Drivetrain Lead", department: "Drivetrain", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Drivetrain Member", department: "Drivetrain", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Jr. Drivetrain Member", department: "Drivetrain", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" }
  ],
  "2024-25": [
    { name: "Untitled", role: "Vice Captain & Dynamics Lead", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Treasury & Finance Head", department: "Management", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Sr. Suspension Engineer", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Telemetry & DAQ Lead", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "FEA & Chassis Engineer", department: "Structures", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" }
  ],
  "2023-24": [
    { name: "Untitled", role: "Junior Vehicle Engineer", department: "Vehicle Dynamics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" },
    { name: "Untitled", role: "Wiring & Harness Member", department: "Electronics", image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team_person.png", linkedin: "https://linkedin.com" }
  ]
};

sql += `\n-- Team Members\n`;
sql += `DO $$\nDECLARE ty_id uuid;\nBEGIN\n`;
Object.keys(teamData).forEach((yearKey, index) => {
  sql += `  INSERT INTO team_years (year_label, sort_order) VALUES (${escapeString(yearKey)}, ${index}) RETURNING id INTO ty_id;\n`;
  teamData[yearKey].forEach((m, m_idx) => {
    sql += `  INSERT INTO team_members (team_year_id, name, role, department, image_url, linkedin_url, sort_order) VALUES (ty_id, ${escapeString(m.name)}, ${escapeString(m.role)}, ${escapeString(m.department)}, ${escapeString(m.image)}, ${escapeString(m.linkedin)}, ${m_idx});\n`;
  });
});
sql += `END $$;\n`;

const sponsorTiers = [
  {
    tierName: "TITLE SPONSORS",
    subtitle: "GENERATING SEASON & VEHICLE ENGINEERING FOUNDATIONS",
    description: "Our premier strategic partners fueling Team Red Baron's championship vehicles, powertrain, and national dynamic operations.",
    sponsors: [
      { name: "ALTIUM", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/ALTIUM.png", website: "https://www.altium.com" },
      { name: "GEFRAN", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/GEFRAN.png", website: "https://www.gefran.com" },
      { name: "MAHLE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/MAHLE.png", website: "https://www.mahle.com" },
      { name: "STAR ENGINEERS", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/STAR ENGINEERS.png", website: "https://www.starengineers.com" },
      { name: "TRIVIKARAM", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/TRIVIKARAM.png", website: "#" },
      { name: "VARROC", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/VARROC.png", website: "https://varroc.com" },
      { name: "ROSENBERGER", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/TITLE/rosenberger.png", website: "https://www.rosenberger.com" }
    ]
  },
  {
    tierName: "PLATINUM SPONSORS",
    subtitle: "PRECISION COMPONENTS, BEARINGS & FLUID SYSTEMS",
    description: "Key industrial partners providing mission-critical dynamic hardware and advanced testing equipment for offroad endurance.",
    sponsors: [
      { name: "SKF", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/SKF.png", website: "https://www.skf.com" },
      { name: "FLUKE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/FLUKE.png", website: "https://www.fluke.com" },
      { name: "CASTAL DIES", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/CASTAL DIES.png", website: "#" },
      { name: "ESBEE", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/ESBEE.png", website: "https://esbee-electrotech.com" },
      { name: "ANUCOOL", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/ANUCOOL.png", website: "#" },
      { name: "C2M", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/PLATINUM/C2M.png", website: "#" }
    ]
  },
  {
    tierName: "GOLD SPONSORS",
    subtitle: "ADVANCED MATERIALS, COATINGS & METROLOGY",
    description: "Pioneering technology suppliers providing specialized composites, electrical harnesses, and precision measurement.",
    sponsors: [
      { name: "MITUTOYO", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/MITUTOYO.png", website: "https://www.mitutoyo.co.jp/global/" },
      { name: "BALAJI WIRES", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/BALAJI WIRES.png", website: "#" },
      { name: "COMPOSITE TOMORROW", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/COMPOSITE TOMORROW.png", website: "#" },
      { name: "BHARAT MECHATRONICS", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/BHARAT MECHATRONICS.png", website: "#" },
      { name: "ELECTRO CATALYST", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/ELECTRO CATALYST.png", website: "#" },
      { name: "VR COATING", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/GOLD/VR COATING.png", website: "#" }
    ]
  },
  {
    tierName: "SILVER SPONSORS",
    subtitle: "MANUFACTURING SUPPORT, FABRICATION & CONNECTIVITY",
    description: "Valued manufacturing partners supplying laser cutting, plasma treatment, specialized connectors, and raw material stock.",
    sponsors: [
      { name: "MOLEX", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/MOLEX.png", website: "https://www.molex.com" },
      { name: "BEICO", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/BEICO.png", website: "#" },
      { name: "METADEK", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/METADEK.png", website: "#" },
      { name: "SHOGINI", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/SHOGINI.png", website: "#" },
      { name: "SHITAL PLASMA", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/SHITAL PLASMA.png", website: "#" },
      { name: "CHINTAMANI", logo: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/sponsors/SILVER/CHINTAMANI.png", website: "#" }
    ]
  }
];

sql += `\n-- Sponsors\n`;
sql += `DO $$\nDECLARE st_id uuid;\nBEGIN\n`;
sponsorTiers.forEach((tier, index) => {
  sql += `  INSERT INTO sponsor_tiers (tier_name, sort_order) VALUES (${escapeString(tier.tierName)}, ${index}) RETURNING id INTO st_id;\n`;
  tier.sponsors.forEach((sp, sp_idx) => {
    sql += `  INSERT INTO sponsors (tier_id, name, logo_url, website_url, sort_order) VALUES (st_id, ${escapeString(sp.name)}, ${escapeString(sp.logo)}, ${escapeString(sp.website)}, ${sp_idx});\n`;
  });
});
sql += `END $$;\n`;

fs.writeFileSync('seed2.sql', sql);
console.log('Done writing seed2.sql');
