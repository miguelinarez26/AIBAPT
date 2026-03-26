const fs = require('fs');
const path = require('path');

const dataRaw = fs.readFileSync('C:\\Users\\User\\.gemini\\antigravity\\brain\\b54f7bbe-bc4c-4554-bc07-ce294a7cfde0\\browser\\scratchpad_fgfxmkd6.md', 'utf8');
const jsonMatch = dataRaw.match(/```json\n([\s\S]*?)\n```/);
if (!jsonMatch) {
    console.error("No JSON found in scratchpad");
    process.exit(1);
}

const extracted = JSON.parse(jsonMatch[1]);

const certMap = {
    "Entrenadores en Brainspotting": "brainspotting_trainer",
    "Entrenadores en EMDR": "emdr_trainer",
    "Entrenadores en Psicodrama": "psychodrama_trainer",
    "Psicoterapeutas certificados en EMDR": "emdr_therapist",
    "Supervisores certificados en EMDR": "emdr_supervisor"
};

const countryMap = {
    "Equador": "Ecuador",
    "Espanha": "España",
    "Peru": "Perú",
    "Brasil e Canadá": "Brasil / Canadá"
};

const consolidated = {};

extracted.forEach(p => {
    const key = p.name;
    if (!consolidated[key]) {
        consolidated[key] = {
            id: Object.keys(consolidated).length + 1,
            name: p.name,
            country: countryMap[p.country] || p.country || "Iberoamérica",
            city: "Internacional",
            certifications: new Set(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=219653&color=fff`,
            email: "info@aibapt.org",
            bio: "Este especialista es miembro de la red internacional AIBAPT y cuenta con validación oficial de sus credenciales profesionales.",
            code: p.id
        };
    }
    if (certMap[p.certification]) {
        consolidated[key].certifications.add(certMap[p.certification]);
    }
    if (p.country && p.country !== "No especificado") {
        consolidated[key].country = countryMap[p.country] || p.country;
    }
});

const partners = Object.values(consolidated).map(p => ({
    ...p,
    certifications: Array.from(p.certifications)
}));

const countries = Array.from(new Set(partners.map(p => p.country))).sort();

const content = "const mockPartners = " + JSON.stringify(partners, null, 4) + ";\n\nconst countriesList = " + JSON.stringify(countries) + ";";
fs.writeFileSync('C:\\Users\\User\\Documents\\AIBAPT\\application\\tmp\\processed_partners.js', content, 'utf8');
console.log("File created successfully");
