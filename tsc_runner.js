const { execSync } = require('child_process');
const fs = require('fs');
try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    console.log('Success, no errors!');
} catch (e) {
    fs.writeFileSync('ts_err_utf8.txt', e.stdout, 'utf-8');
    console.log('Saved to ts_err_utf8.txt');
}
