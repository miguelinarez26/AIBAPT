const https = require('https');
const fs = require('fs');

https.get('https://esp.aibapt.org/memberslist-general', (resp) => {
  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });
  resp.on('end', () => {
    fs.writeFileSync('C:/Users/User/Documents/AIBAPT/application/tmp/members.html', data);
    console.log('Done downloading html');
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
