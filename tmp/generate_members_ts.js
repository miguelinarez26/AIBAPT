const fs = require('fs');

const raw = fs.readFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/parsed_all_members.json', 'utf8');
const members = JSON.parse(raw);

// Convert standard categories
const categoryMap = {
    "Miembros fundadores": "fundador",
    "Miembros institucionales": "institucional",
    "Miembros plenos": "pleno",
    "Psicoterapeutas certificados en EMDR": "psicoterapeuta",
    "Supervisores certificados en EMDR": "supervisor",
    "Simpatizantes": "simpatizante"
};

let processed = members.map((m, index) => {
    return {
        id: index + 1,
        name: m.name,
        code: m.code,
        category: categoryMap[m.category] || "simpatizante",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=219653&color=fff`,
        email: "info@aibapt.org"
    };
});

let tsContent = `export interface Member {
  id: number;
  name: string;
  category: string;
  avatar: string;
  code: string;
  email: string;
}

export const membersCategories = [
    "fundador",
    "institucional",
    "pleno",
    "psicoterapeuta",
    "supervisor",
    "simpatizante"
];

export const membersData: Member[] = ${JSON.stringify(processed, null, 4)};
`;

fs.mkdirSync('C:/Users/User/Documents/AIBAPT/application/src/app/miembros', { recursive: true });
fs.writeFileSync('C:/Users/User/Documents/AIBAPT/application/src/app/miembros/membersData.ts', tsContent);
console.log('membersData.ts generated!');
