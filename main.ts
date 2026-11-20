// gta6-clipper-01 entry program (Node 22, standard library only).
//
// The entry is the YouTube video itself; this program's only job is to hand
// the gate the video's address. It reads VIDEO.json from the repository,
// checks that the address is a real YouTube video address, and writes the
// exact same bytes to the output directory, so two runs always produce the
// same file. It never touches the network, the clock, or any file outside
// the repository.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`VIDEO.json rejected: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, 'VIDEO.json');

let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`could not be read from ${sourcePath}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString('utf8'));
} catch (err) {
  fail(`is not valid JSON: ${(err as Error).message}`);
}

if (typeof parsed !== 'object' || parsed === null || !('url' in parsed)) {
  fail('must be a JSON object with a "url" field');
}

const url = (parsed as { url: unknown }).url;
if (typeof url !== 'string' || url.length === 0) {
  fail('"url" must be a non-empty string');
}

let address: URL;
try {
  address = new URL(url);
} catch {
  fail(`"url" is not a valid address: ${url}`);
}

const host = address.hostname.replace(/^www\./, '');
if (host !== 'youtube.com' && host !== 'youtu.be') {
  fail(`"url" must point at YouTube, not ${address.hostname}`);
}
if (host === 'youtube.com' && !address.pathname.startsWith('/shorts/') && !address.pathname.startsWith('/watch')) {
  fail(`"url" must be a YouTube watch or Shorts address: ${url}`);
}
if (host === 'youtube.com' && address.pathname.startsWith('/watch') && !address.searchParams.has('v')) {
  fail(`"url" must name a video id with a "v" parameter: ${url}`);
}
if (host === 'youtu.be' && address.pathname.length < 2) {
  fail(`"url" must name a video id: ${url}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'VIDEO.json'), raw);
console.log(`VIDEO.json OK: ${url}`);
