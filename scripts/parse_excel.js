const xlsx = require('xlsx');
const fs = require('fs');

const workbook = xlsx.readFile('Team_Red_Baron_Roster.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

console.log(JSON.stringify(data, null, 2));
