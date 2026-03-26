const fs = require('fs');

const raw = fs.readFileSync('C:\\Users\\User\\Documents\\AIBAPT\\application\\tmp\\processed_partners.js', 'utf8');

// Convert to ESM export
let content = raw.replace('const mockPartners =', 'export const mockPartners =');
content = content.replace('const countriesList =', 'export const countriesList =');

// Add types
const finalContent = `export interface Partner {
  id: number;
  name: string;
  country: string;
  city: string;
  certifications: string[];
  avatar: string;
  email: string;
  bio: string;
  code?: string;
}

${content}`;

fs.writeFileSync('C:\\Users\\User\\Documents\\AIBAPT\\application\\src\\app\\socios\\partnersData.ts', finalContent, 'utf8');
console.log("File created at src/app/socios/partnersData.ts");
