const fs = require('fs');

const raw = fs.readFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/members.html', 'utf8');

// The names seem to be inside divs or tables. 
// A typical table row in HTML might look like <td ...>Name</td>
// Let's print the first 20 occurrences of 'td>' or something similar
const matches = raw.match(/<td[^>]*>(.*?)<\/td>/g);
if (matches) {
    console.log("Found table cells:");
    for (let i = 0; i < 40 && i < matches.length; i++) {
        console.log(matches[i].substring(0, 100));
    }
} else {
    console.log("No table cells found. Exploring generic lists or divs...");
    const matchesDiv = raw.match(/<div[^>]*>(.*?)<\/div>/g);
    if (matchesDiv) {
        for (let i = 0; i < 20 && i < matchesDiv.length; i++) {
            console.log(matchesDiv[i].replace(/<[^>]*>?/gm, '').trim().substring(0, 50));
        }
    }
}
