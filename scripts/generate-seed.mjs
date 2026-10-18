import fs from 'fs';

const escapeString = (str) => {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
};

const vehicles = [
  {
    year: "2026",
    vehicleName: "Albatros XIV",
    rank: "AIR 3 National",
    subtitle: "AIR 3 Overall Podium & BEST 4WD",
    badge: "BEST 4WD",
    icon: "ShieldCheck",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/assets/images/albatros-xiii.png",
    description: "Secured AIR 3 overall and AIR 4 in both Statics and Dynamics, emerging as the best-performing 4WD vehicle and continuing the team’s engineering evolution.",
    specs: [
      { label: "OVERALL RANK", val: "AIR 3 National" },
      { label: "STATICS RANK", val: "AIR 4 Overall" },
      { label: "DYNAMICS RANK", val: "AIR 4 Overall" },
      { label: "AWARD", val: "Best 4WD Vehicle" }
    ],
    // flagship fields
    status_badge: "RACE READY",
    background_video_url: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/assets/videos/trb_bg_optimized.mp4",
    chassis_serial: "TRB-2026-X14"
  },
  {
    year: "2025",
    vehicleName: "Albatros XIII",
    rank: "AIR 3 National",
    subtitle: "AIR 3 Overall Podium & AIR 1 Statics",
    badge: "AIR 3 PODIUM",
    icon: "ShieldCheck",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2025.jpg",
    description: "Achieved AIR 3 Overall National Rank at BAJA SAE India 2025 in Hyderabad. Secured AIR 1 Overall Statics, AIR 3 Sled Pull, and AIR 2 in CAE & Cost Evaluations among 100+ national universities.",
    specs: [
      { label: "OVERALL RANK", val: "AIR 3 National" },
      { label: "STATICS RANK", val: "AIR 1 Overall" },
      { label: "SLED PULL", val: "AIR 3 Podium" },
      { label: "CAE & COST", val: "AIR 2 National" }
    ]
  },
  {
    year: "2024",
    vehicleName: "e-BAJA SAE 2024",
    rank: "National Runner-Up",
    subtitle: "National Overall Runner-Up — Electric Era",
    badge: "ELECTRIC PODIUM",
    icon: "Zap",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2024.jpg",
    description: "Achieved National Overall Runner-Up at e-BAJA SAE India 2024. Won prestigious awards including Green Efficient Vehicle, Engineering Design Champion, and Technical Innovation Award.",
    specs: [
      { label: "OVERALL", val: "National Runner-Up" },
      { label: "POWERTRAIN", val: "High Torque EV Motor" },
      { label: "AWARDS", val: "Green Efficient & Design" },
      { label: "INNOVATION", val: "1st Rank Tech Award" }
    ]
  },
  {
    year: "2023",
    vehicleName: "Albatros XII",
    rank: "Telemetry Era",
    subtitle: "Advanced IoT Telemetry & Dynamic Rigidity",
    badge: "TELEMETRY ERA",
    icon: "Cpu",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2023.png",
    description: "Integrated real-time wireless IoT pitwall telemetry streaming wheel speeds, CVT temperatures, and suspension travel metrics live. Optimized chassis weight reduction by 14% with enhanced torsional stiffness.",
    specs: [
      { label: "TELEMETRY", val: "Real-Time Wireless IoT" },
      { label: "CHASSIS", val: "-14% Weight Saved" },
      { label: "SUSPENSION", val: "16\" Wheel Travel" },
      { label: "DATA FEED", val: "Live Pit Dashboard" }
    ]
  },
  {
    year: "2022",
    vehicleName: "Albatros XR",
    rank: "1st AIR Statics",
    subtitle: "Best 4WD ATV & 1st Overall Statics",
    badge: "BEST 4WD ATV",
    icon: "Trophy",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2022.avif",
    description: "Awarded 'Best 4WD ATV' & 1st Rank in Overall Statics at BAJA SAE India 2022. First collegiate team to clear complete Technical Inspection on the very first attempt without callbacks.",
    specs: [
      { label: "STATICS", val: "1st Rank AIR" },
      { label: "AWARD", val: "Best 4WD ATV" },
      { label: "TECH INSPECT", val: "Passed 1st Attempt" },
      { label: "SUSPENSION", val: "Dual A-Arm Air Shocks" }
    ]
  },
  {
    year: "2021",
    vehicleName: "Albatros X",
    rank: "1st AIR Design",
    subtitle: "First Four-Wheel-Drive (4WD) ATV",
    badge: "4WD INNOVATION",
    icon: "Zap",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2021.avif",
    description: "Pioneered Team Red Baron's first custom 4WD transfer case and custom front differential setup. Dominated BAJA SAE India 2021 Overall Design Standings and earned 2nd Runner-Up Cost internationally.",
    specs: [
      { label: "DRIVETRAIN", val: "First 4WD Spec" },
      { label: "DESIGN", val: "1st Standings AIR" },
      { label: "INTL COST", val: "2nd Runner-Up" },
      { label: "TRANSFER CASE", val: "Custom CNC Al" }
    ]
  },
  {
    year: "2020",
    vehicleName: "Albatros 9.0",
    rank: "Overall Runner-Up",
    subtitle: "Custom In-House CVT S1 & ESI Runner-Up",
    badge: "CVT INNOVATION",
    icon: "Cpu",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2020.avif",
    description: "Engineered the team's first custom in-house CVT calibration and reduction gearbox. Won ESI 2020 Overall Runner-Up (1st Design, 1st Cost, 2nd Endurance, Fastest Lap) and 3rd Design at BAJA SAE India.",
    specs: [
      { label: "ESI OVERALL", val: "2nd Rank Runner-Up" },
      { label: "CVT DYNAMICS", val: "In-House S1 Spec" },
      { label: "FASTEST LAP", val: "Winner ESI" },
      { label: "DESIGN", val: "3rd AIR India" }
    ]
  },
  {
    year: "2019",
    vehicleName: "Albatros 8.0",
    rank: "Top 5 AIR",
    subtitle: "BAJA USA Rochester NY & Triple Competition",
    badge: "TRIPLE COMPETITION",
    icon: "Sparkles",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2019.avif",
    description: "Competed simultaneously across 3 premier championships: BAJA SAE India (Top 5), ESI (1st Design, 2nd Cost, 3rd Endurance), and BAJA SAE USA in Rochester, New York.",
    specs: [
      { label: "USA VENUE", val: "Rochester NY" },
      { label: "ESI DESIGN", val: "1st Rank Winner" },
      { label: "INDIA RANK", val: "Top 5 Overall" },
      { label: "ESI COST", val: "2nd Rank" }
    ]
  },
  {
    year: "2018",
    vehicleName: "Albatros 7.0",
    rank: "2nd AIR Endurance",
    subtitle: "Runner-Up Durability Award",
    badge: "NATIONAL PODIUM",
    icon: "Trophy",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2018.avif",
    description: "Secured 2nd Place in the 4-Hour Endurance Race at BAJA SAE India along with the Runner-Up Durability Award. Followed up with an Overall 2nd Runner-Up finish at Enduro Student India (ESI) 2018.",
    specs: [
      { label: "ENDURANCE", val: "2nd Rank AIR" },
      { label: "DURABILITY", val: "Runner-Up Award" },
      { label: "ESI 2018", val: "2nd Runner-Up" },
      { label: "TOP SPEED", val: "58 km/h Dirt" }
    ]
  },
  {
    year: "2017",
    vehicleName: "Albatros 6.0",
    rank: "Overall Runner-Up",
    subtitle: "BAJA USA Illinois Debut & ESI Runner-Up",
    badge: "INTERNATIONAL USA",
    icon: "Flag",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2017.avif",
    description: "Expanded onto the international stage at BAJA SAE Illinois USA (7th fastest lap overall). Claimed ESI 2017 Overall Runner-Up (1st in Design) and MegaATV Overall Runner-Up titles.",
    specs: [
      { label: "USA DEBUT", val: "BAJA Illinois USA" },
      { label: "ESI 2017", val: "Overall Runner-Up" },
      { label: "DESIGN", val: "1st Rank ESI" },
      { label: "MEGAATV", val: "Overall 2nd Rank" }
    ]
  },
  {
    year: "2016",
    vehicleName: "Albatros 5.0",
    rank: "5th AIR Design",
    subtitle: "Tech Innovation Composite Steering",
    badge: "COMPOSITE TECH",
    icon: "Zap",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2016.avif",
    description: "Won 2nd Prize in Technical Innovation for lightweight composite steering linkage design. Secured 5th in Engineering Design, 6th Lightest Vehicle overall, and 7th in Acceleration.",
    specs: [
      { label: "TECH AWARD", val: "2nd Composite Linkage" },
      { label: "DESIGN RANK", val: "5th AIR" },
      { label: "WEIGHT RANK", val: "6th Lightest ATV" },
      { label: "ACCELERATION", val: "7th AIR" }
    ]
  },
  {
    year: "2015",
    vehicleName: "Albatros 4.0",
    rank: "12th AIR",
    subtitle: "4-Hour Endurance Landmark",
    badge: "ENDURANCE PROVEN",
    icon: "ShieldCheck",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2015.avif",
    description: "Became the team's first ATV to complete the brutal 4-hour BAJA SAE endurance race without a single mechanical breakdown. Tested structural longevity and thermal endurance under extreme track heat.",
    specs: [
      { label: "ENDURANCE", val: "4-Hour Full Finish" },
      { label: "OVERALL RANK", val: "12th AIR" },
      { label: "RELIABILITY", val: "0 Mech Failures" },
      { label: "CHASSIS", val: "Chromoly 4130" }
    ]
  },
  {
    year: "2014",
    vehicleName: "Albatros 3.0",
    rank: "8th AIR Podium",
    subtitle: "Best Engineering Design Winner",
    badge: "DESIGN CHAMPION",
    icon: "Trophy",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2014.avif",
    description: "Captured the coveted 'Best Engineering Design' national award. Cleared the steep hill-climb challenge in a record 13 seconds with flawless maneuverability, elevating TRB into the national top 10.",
    specs: [
      { label: "AWARD", val: "Best Engineering Design" },
      { label: "OVERALL", val: "8th AIR Podium" },
      { label: "HILL CLIMB", val: "13 Seconds" },
      { label: "MANEUVERABILITY", val: "Zero Penalty" }
    ]
  },
  {
    year: "2013",
    vehicleName: "Albatros 2.0",
    rank: "30th AIR",
    subtitle: "Suspension Tech — Top 5 Innovation Award",
    badge: "INNOVATION NOMINEE",
    icon: "Cpu",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2013.avif",
    description: "Pioneered an independent leaf spring front suspension mechanism that earned a nomination in the Top 5 Innovations at BAJA SAE India 2013. Climbed 4 ranks nationally against 125 collegiate teams.",
    specs: [
      { label: "SUSPENSION", val: "Independent Leaf Spring" },
      { label: "RANK", val: "30th AIR / 125 Teams" },
      { label: "AWARD", val: "Top 5 Tech Innovation" },
      { label: "EVENT", val: "Pithampur Track" }
    ]
  },
  {
    year: "2012",
    vehicleName: "Albatros 1.0",
    rank: "34th AIR",
    subtitle: "The Genesis — PCCOE BAJA Foundation",
    badge: "FOUNDING ERA",
    icon: "Flag",
    imageSrc: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/images_timeline/2012.avif",
    description: "Founded by 25 passionate undergraduates at PCCOE Pune inspired by Capt. Manfred von Richthofen 'The Red Baron'. Albatros 1.0 successfully completed its maiden national dynamic events and established the engineering foundation for Team Red Baron.",
    specs: [
      { label: "FRAME", val: "Tubular Spaceframe" },
      { label: "RANK", val: "34th AIR" },
      { label: "TEAM SIZE", val: "25 Engineers" },
      { label: "COMPETITION", val: "BAJA SAE India" }
    ]
  }
];

const teamPhotos = [
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG_0293.JPG", caption: "Team Red Baron — Official Lineup" },
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG20260111135725.jpg", caption: "Off-Road Championship Crew" },
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG-20260111-WA0014.jpg", caption: "Team Red Baron Engineers" },
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/20260220_161730.jpg", caption: "BAJA Expedition & Field Testing" },
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG-20250219-WA0027.jpg", caption: "Paddock Prep & Pit Operations" },
  { image: "https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG_9368.jpg", caption: "Technical Scrutineering & Strategy" }
];

let sql = `-- Singletons\n`;
sql += `INSERT INTO site_settings (id, hero_tagline) VALUES (1, 'Innovate. Engineer. Evolve.') ON CONFLICT (id) DO UPDATE SET hero_tagline = EXCLUDED.hero_tagline;\n`;

sql += `INSERT INTO about_content (id, intro_headline, intro_summary, vision_text, mission_text, team_photo_url, team_photo_caption) VALUES (1, 'THE LEGACY OF UNTAMED ENDURANCE', 'Team Red Baron is Pimpri Chinchwad College of Engineering’s official collegiate offroad racing team. We design, manufacture, test, and race high-performance All-Terrain Vehicles (ATVs) for national BAJA SAE India competitions.', 'To become a leading student motorsports team recognized for innovation, technical excellence, and teamwork in designing and developing high-performance electric All-Terrain Vehicles, while representing the institution successfully at national and international competitions such as eBAJA SAE India and Baja SAE International.', 'To design and manufacture reliable, competitive electric ATVs through innovative engineering, while developing technical, leadership, and teamwork skills through hands-on learning, representing our institution with excellence, and advancing sustainable automotive technologies.', 'https://axzwucvnrjtenvvrxfew.supabase.co/storage/v1/object/public/trb-media/team/IMG_9368.jpg', 'Team Red Baron Squad') ON CONFLICT (id) DO UPDATE SET intro_headline = EXCLUDED.intro_headline;\n`;

sql += `INSERT INTO contact_info (id, email, address, instagram_url, linkedin_url, youtube_url, twitter_url) VALUES (1, 'teamredbaron07@gmail.com', 'Pimpri Chinchwad College of Engineering (PCCOE)\\nSector 26, Pradhikaran, Nigdi, Pune, Maharashtra 411044', 'https://www.instagram.com/team_red_baron?igsh=MWFwcnl6Y2ZlZzlwdA==', 'https://www.linkedin.com/company/team-red-baron/posts/?feedView=all', 'https://youtube.com/@teamredbaron4316?feature=shared', '') ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;\n`;

sql += `\n-- Vehicles and Specs\n`;
sql += `DO $$\nDECLARE v_id uuid;\nBEGIN\n`;

vehicles.forEach((v, index) => {
  sql += `  INSERT INTO vehicles (year, vehicle_name, chassis_serial, subtitle, rank_text, badge_text, icon_key, description, image_url, status_badge, background_video_url, timeline_order) VALUES (${escapeString(v.year)}, ${escapeString(v.vehicleName)}, ${escapeString(v.chassis_serial)}, ${escapeString(v.subtitle)}, ${escapeString(v.rank)}, ${escapeString(v.badge)}, ${escapeString(v.icon)}, ${escapeString(v.description)}, ${escapeString(v.imageSrc)}, ${escapeString(v.status_badge)}, ${escapeString(v.background_video_url)}, ${index}) RETURNING id INTO v_id;\n`;
  if (index === 0) {
    sql += `  UPDATE site_settings SET flagship_vehicle_id = v_id WHERE id = 1;\n`;
  }
  v.specs.forEach((s, s_idx) => {
    sql += `  INSERT INTO vehicle_specs (vehicle_id, label, value, sort_order) VALUES (v_id, ${escapeString(s.label)}, ${escapeString(s.val)}, ${s_idx});\n`;
  });
});

sql += `END $$;\n`;

sql += `\n-- Team Photos (OFF THE MAP)\n`;
teamPhotos.forEach((tp, idx) => {
  sql += `INSERT INTO team_photos (image_url, caption, sort_order) VALUES (${escapeString(tp.image)}, ${escapeString(tp.caption)}, ${idx});\n`;
});

// Since Team Years and Sponsors are many lines, let's keep it simple and just do what we can for now to have the site working, and we'll add more in the next chunk if needed.

fs.writeFileSync('seed.sql', sql);
console.log('Done writing seed.sql');
