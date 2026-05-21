import fs from 'fs';
import path from 'path';
import testData from '../data/testData.json';

const STATE_PATH = path.resolve(__dirname, '../.runtime/vehicle-vin-state.json');

type VinState = {
  consumed: string[];
};

function readState(): VinState {
  if (!fs.existsSync(STATE_PATH)) {
    return { consumed: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8')) as VinState;
  } catch {
    return { consumed: [] };
  }
}

function writeState(state: VinState): void {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

export function markVinConsumed(serial: string): void {
  const state = readState();
  if (!state.consumed.includes(serial)) {
    state.consumed.push(serial);
    writeState(state);
  }
}

export function allocateFreshVin(reserved: string[] = []): string {
  const pool = testData.newVehicleRegistration.unregisteredSerialNumbers;
  const state = readState();
  const blocked = new Set([...state.consumed, ...reserved]);
  const next = pool.find((serial) => !blocked.has(serial));
  if (next) {
    return next;
  }
  const fallback = pool.find((serial) => !reserved.includes(serial));
  if (!fallback) {
    throw new Error('No unregistered VINs remain in the newVehicleRegistration pool');
  }
  return fallback;
}

export function getKnownRegisteredVin(accountKey: string): string | undefined {
  const account = testData.newVehicleRegistration.accounts[accountKey as keyof typeof testData.newVehicleRegistration.accounts];
  return account?.registeredVin;
}
