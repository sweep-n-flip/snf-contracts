#!/usr/bin/env node
/**
 * Non-interactive Goldsky login.
 *
 * Reads GOLDSKY_API_KEY from the root .env (snf-contracts/.env) and passes it
 * to `goldsky login --token`. Credentials are cached in ~/.goldsky/config so
 * subsequent `goldsky subgraph deploy` calls work without re-login.
 *
 * Run this once per machine (or whenever the key rotates):
 *   pnpm goldsky:login
 *
 * Running it again is idempotent.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, '..', '..', '.env');

function parseDotenv(file) {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!m) continue;
    const [, k, vRaw] = m;
    const v = vRaw.replace(/^['"]|['"]$/g, '');
    if (/^\{\{.*\}\}$/.test(v)) continue; // skip unreplaced mustache placeholders
    out[k] = v;
  }
  return out;
}

const env = { ...process.env, ...parseDotenv(envPath) };
const key = env.GOLDSKY_API_KEY;

if (!key) {
  console.error('GOLDSKY_API_KEY not set. Add it to snf-contracts/.env (copy from .env.sample) or export it in your shell.');
  console.error('Obtain a key at https://app.goldsky.com/ → Project Settings → API Keys.');
  process.exit(1);
}

console.log('Logging into Goldsky with key from .env (first 6 chars: ' + key.slice(0, 6) + '...)');

const result = spawnSync('npx', ['--yes', '@goldskycom/cli', 'login', '--token', key], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 1);
