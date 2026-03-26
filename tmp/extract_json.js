const fs = require('fs');

const raw = fs.readFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/members.html', 'utf8');

// The divs might be nested, so simply extracting div innerText could have duplicates.
// However, the text seems clean when replacing tags. Let's try to extract text nodes in order.
// A simpler robust way without DOM parser:
// 1. Remove script and style tags.
const noScript = raw.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
const noStyle = noScript.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

// Extract all tags and text
const tokens = noStyle.split(/(<[^>]*>)/);
let textBlocks = [];
for (let token of tokens) {
    if (!token.startsWith('<')) {
        let clean = token.replace(/&nbsp;/g, ' ').trim();
        if (clean.length > 0) {
            textBlocks.push(clean);
        }
    }
}

const categories = [
    "Miembros fundadores",
    "Miembros institucionales",
    "Miembros plenos",
    "Psicoterapeutas certificados en EMDR",
    "Supervisores certificados en EMDR",
    "Simpatizantes"
];

let result = [];
let currentCategory = null;
let mode = 'search_category'; // modes: search_category, skip_headers, reading_data
let nextIsNumber = false;
let currentName = '';

for (let text of textBlocks) {
    if (categories.includes(text)) {
        currentCategory = text;
        mode = 'skip_headers';
        continue;
    }

    if (mode === 'skip_headers') {
        if (text === 'NÚMERO') {
            mode = 'reading_data';
            nextIsNumber = false;
        }
        continue;
    }

    if (mode === 'reading_data') {
        // If we hit copyright or a known footer text, stop.
        if (text.includes('© 2026') || text.includes('MUDAR PARA') || text.includes('Términos de uso')) {
            mode = 'search_category'; // might be end of list
            continue;
        }

        // Sometimes the category might be repeatedly printed or something?
        if (categories.includes(text)) {
            currentCategory = text;
            mode = 'skip_headers';
            continue;
        }

        // Wait, some numbers might be missing?
        // Let's assume alternate name / number
        if (!nextIsNumber) {
            currentName = text;
            nextIsNumber = true;
        } else {
            // It's the number
            result.push({
                name: currentName,
                code: text,
                category: currentCategory
            });
            nextIsNumber = false;
        }
    }
}

console.log("Extracted members: ", result.length);
fs.writeFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/parsed_all_members.json', JSON.stringify(result, null, 2));

