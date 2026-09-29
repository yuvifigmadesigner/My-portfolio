// Renders the Better Decisions cover video (tools/teaser/teaser.html) with Microsoft Edge's
// built-in H.264 encoder and saves it to Assets/decisions/teaser/.
// Run from the project folder:  node tools/teaser/make-teaser.mjs
// Needs Node 22+ and Microsoft Edge. Nothing is downloaded.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'Assets', 'decisions', 'teaser');
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find((p) => { try { return statSync(p).isFile(); } catch { return false; } });
if (!EDGE) throw new Error('Microsoft Edge not found');

// the two copies the page picks from: sharp for big screens, light for phones.
// scale × 714 × 405 must come out even (H.264), so 2 (1428 × 810) and 4/3 (952 × 540).
const VIDEOS = [
  { file: 'teaser-1428.mp4', scale: 2, fps: 60, qp: Number(process.env.QP_BIG || 34) },
  { file: 'teaser-952.mp4', scale: 4 / 3, fps: 60, qp: Number(process.env.QP_SMALL || 35) },
];

/* A tiny static server for the project, so the page can load its images and font */
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!path.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = readFileSync(path);
    res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const pageUrl = `http://127.0.0.1:${server.address().port}/tools/teaser/teaser.html?render`;

/* Headless Edge, driven over the DevTools protocol */
const profile = mkdtempSync(join(tmpdir(), 'teaser-edge-'));
const PORT = 9300 + Math.floor(Math.random() * 500);
const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

async function target() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Edge did not start');
}

const ws = new WebSocket(await target());
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let nextId = 0;
const pending = new Map();
const events = [];
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.id && pending.has(data.id)) {
    const { resolve: ok, reject: fail } = pending.get(data.id);
    pending.delete(data.id);
    if (data.error) fail(new Error(data.error.message)); else ok(data.result);
  } else if (data.method) {
    events.push(data);
    if (data.method === 'Runtime.consoleAPICalled') console.log('  page:', data.params.args.map((a) => a.value).join(' '));
    if (data.method === 'Runtime.exceptionThrown') console.log('  page error:', data.params.exceptionDetails.exception?.description);
  }
};
const send = (method, params = {}) => new Promise((ok, fail) => {
  const id = ++nextId;
  pending.set(id, { resolve: ok, reject: fail });
  ws.send(JSON.stringify({ id, method, params }));
});
async function evaluate(expression) {
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
  return result.value;
}

try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Page.navigate', { url: pageUrl });
  for (let i = 0; i < 100 && !(await evaluate('!!window.teaser').catch(() => false)); i++) await new Promise((r) => setTimeout(r, 100));
  await evaluate('teaser.prepare()');
  mkdirSync(OUT, { recursive: true });

  for (const v of VIDEOS) {
    const started = Date.now();
    const r = await evaluate(`teaser.encode(${JSON.stringify(v)})`);
    writeFileSync(join(OUT, v.file), Buffer.from(r.mp4, 'base64'));
    console.log(`  ${v.file}  ${r.width}×${r.height}  ${r.frames} frames  ${r.codec}  ${(r.bytes / 1024).toFixed(0)} KB  (${((Date.now() - started) / 1000).toFixed(1)}s)`);
  }
  const poster = await evaluate('teaser.poster(2)');
  writeFileSync(join(OUT, 'poster.webp'), Buffer.from(poster.split(',')[1], 'base64'));
  console.log(`  poster.webp  ${(statSync(join(OUT, 'poster.webp')).size / 1024).toFixed(0)} KB`);
} finally {
  ws.close();
  edge.kill();
  server.close();
  setTimeout(() => { try { rmSync(profile, { recursive: true, force: true }); } catch { /* Edge may still hold it */ } }, 1500);
}
