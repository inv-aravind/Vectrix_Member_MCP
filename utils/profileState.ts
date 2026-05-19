import fs from 'fs';
import path from 'path';
import type { ProfileSnapshot } from '../page-objects/AccountSettings.page';

const stateDir = path.resolve(__dirname, '../.runtime');
const stateFile = path.join(stateDir, 'profile-state.json');

function ensureStateDir(): void {
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }
}

export function readProfileBaseline(): ProfileSnapshot | null {
  ensureStateDir();
  if (!fs.existsSync(stateFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(stateFile, 'utf-8')) as ProfileSnapshot;
}

export function writeProfileBaseline(snapshot: ProfileSnapshot): void {
  ensureStateDir();
  fs.writeFileSync(stateFile, JSON.stringify(snapshot, null, 2), 'utf-8');
}

export function getProfileStateFilePath(): string {
  return stateFile;
}
