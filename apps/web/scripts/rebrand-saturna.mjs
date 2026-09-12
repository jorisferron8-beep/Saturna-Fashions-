import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'src');

const pairs = [
    ['customerservice@ravyne.com', 'customerservice@saturna.com'],
    ['support@ravyne.com', 'support@saturna.com'],
    ['servicelegals@swu-vision.us', 'servicelegals@swu-vision.us'],
    ['ravyne:open-cart', 'saturna:open-cart'],
    ['RAVYNE', 'SATURNA'],
    ['Ravyne', 'Saturna'],
    ['ravyne', 'saturna'],
];

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p, out);
        else if (/\.(jsx?|css|html)$/.test(name)) out.push(p);
    }
    return out;
}

for (const file of walk(root)) {
    let s = fs.readFileSync(file, 'utf8');
    const orig = s;
    for (const [a, b] of pairs) s = s.split(a).join(b);
    // placeholder svg text
    if (s.includes('UkFWWU5F')) {
        // base64 RAVYNE -> leave or replace later
    }
    if (s !== orig) {
        fs.writeFileSync(file, s);
        console.log('updated', path.relative(root, file));
    }
}
