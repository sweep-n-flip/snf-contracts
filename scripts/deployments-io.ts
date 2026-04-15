/**
 * Persistent deployment records at `deployments/<chainId>.json`.
 *
 * After a successful deploy the addresses are written here so:
 *  - Resume scenarios work without re-exporting env vars
 *  - `verify.ts` can run standalone
 *  - Subgraph configs and snf-client configs can be regenerated
 *
 * These files are public information (they just contain deployed addresses) and
 * are safe to commit.
 */

import fs from 'fs';
import path from 'path';

export interface DeploymentRecord {
  chainId: number;
  network?: string;
  admin?: string;
  delegateRouter?: string;
  factory?: string;
  router?: string;
  wrapper?: string;
  pair?: string;
  blockies?: string;
  initCodeHash?: string;
  factoryFrom?: string;
  updatedAt?: string;
}

const DIR = path.join(__dirname, '..', 'deployments');

function filePath(chainId: number): string {
  return path.join(DIR, `${chainId}.json`);
}

export function loadDeployment(chainId: number): DeploymentRecord {
  const p = filePath(chainId);
  if (!fs.existsSync(p)) return { chainId };
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { chainId };
  }
}

export function saveDeployment(chainId: number, partial: Partial<DeploymentRecord>): void {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  const current = loadDeployment(chainId);
  const merged: DeploymentRecord = {
    ...current,
    ...partial,
    chainId,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(filePath(chainId), JSON.stringify(merged, null, 2) + '\n');
}
