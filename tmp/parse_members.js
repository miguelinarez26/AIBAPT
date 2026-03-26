const fs = require('fs');

const raw = fs.readFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/members.html', 'utf8');

// I will just use regex to extract titles and lists
// Since I don't have cheerio, I'll print the first 2000 characters to see the structure
console.log(raw.substring(0, 2000));
