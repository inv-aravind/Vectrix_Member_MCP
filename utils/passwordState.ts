import fs from 'fs';
import path from 'path';

export type PasswordStateRecord = {
  initialPassword: string;
  currentPassword: string;
  previousPassword: string | null;
  updatedAt: string;
  updatedBy: string;
};

const stateDir = path.resolve(__dirname, '../.runtime');
const stateFile = path.join(stateDir, 'password-state.json');

function ensureStateDir(): void {
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }
}

export function getInitialPassword(): string {
  return process.env.VALID_PASSWORD ?? 'Password@123';
}

export function readPasswordState(): PasswordStateRecord | null {
  ensureStateDir();
  if (!fs.existsSync(stateFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(stateFile, 'utf-8')) as PasswordStateRecord;
}

export function getCurrentPassword(): string {
  return readPasswordState()?.currentPassword ?? getInitialPassword();
}

export function initializePasswordState(updatedBy = 'suite-init'): PasswordStateRecord {
  const initialPassword = getInitialPassword();
  const record: PasswordStateRecord = {
    initialPassword,
    currentPassword: initialPassword,
    previousPassword: null,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  writePasswordState(record);
  return record;
}

export function writePasswordState(record: PasswordStateRecord): void {
  ensureStateDir();
  fs.writeFileSync(stateFile, JSON.stringify(record, null, 2), 'utf-8');
}

export function setCurrentPassword(currentPassword: string, updatedBy: string): PasswordStateRecord {
  const existing = readPasswordState() ?? initializePasswordState(updatedBy);
  const record: PasswordStateRecord = {
    initialPassword: existing.initialPassword,
    currentPassword,
    previousPassword: existing.currentPassword,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
  writePasswordState(record);
  return record;
}

export function getPasswordStateFilePath(): string {
  return stateFile;
}
