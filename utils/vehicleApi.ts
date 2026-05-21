import type { APIRequestContext } from '@playwright/test';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.mobipark-members.innovaturelabs.net';

export type VehicleValidateResponse = {
  serialNumber?: string;
  brand?: string;
  name?: string;
  purchaseDate?: string | null;
  warrantyType?: number;
  isCurrentOwner?: boolean;
  message?: string;
};

export async function validateVehicleSerial(
  request: APIRequestContext,
  serialNumber: string,
): Promise<{ status: number; body: VehicleValidateResponse | null }> {
  const response = await request.get(`${API_BASE}/api/vehicles/validate`, {
    params: { serialNumber: serialNumber.trim() },
  });
  let body: VehicleValidateResponse | null = null;
  try {
    body = (await response.json()) as VehicleValidateResponse;
  } catch {
    body = null;
  }
  return { status: response.status(), body };
}

export function addYearsToDate(dateText: string, years: number): string {
  const [year, month, day] = dateText.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCFullYear(date.getUTCFullYear() + years);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysSinceDelivery(deliveryDate: string, today = new Date()): number {
  const [year, month, day] = deliveryDate.split('-').map(Number);
  const delivery = new Date(Date.UTC(year, month - 1, day));
  const current = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const diffMs = current.getTime() - delivery.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
