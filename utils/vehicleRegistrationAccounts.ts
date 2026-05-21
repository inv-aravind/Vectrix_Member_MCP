export type VehicleRegistrationAccountKey = 'user1000' | 'user1001' | 'user1002' | 'user1003';

const accountEnvMap: Record<VehicleRegistrationAccountKey, { email: string; password: string }> = {
  user1000: {
    email: process.env.NEW_VEHICLE_EMAIL_1000 ?? 'reacharavindh.s14+1000@gmail.com',
    password: process.env.NEW_VEHICLE_PASSWORD ?? 'Password@123',
  },
  user1001: {
    email: process.env.NEW_VEHICLE_EMAIL_1001 ?? 'reacharavindh.s14+1001@gmail.com',
    password: process.env.NEW_VEHICLE_PASSWORD ?? 'Password@123',
  },
  user1002: {
    email: process.env.NEW_VEHICLE_EMAIL_1002 ?? 'reacharavindh.s14+1002@gmail.com',
    password: process.env.NEW_VEHICLE_PASSWORD ?? 'Password@123',
  },
  user1003: {
    email: process.env.NEW_VEHICLE_EMAIL_1003 ?? 'reacharavindh.s14+1003@gmail.com',
    password: process.env.NEW_VEHICLE_PASSWORD ?? 'Password@123',
  },
};

export function getVehicleRegistrationAccount(key: VehicleRegistrationAccountKey): {
  email: string;
  password: string;
} {
  return accountEnvMap[key];
}

export function getNoVehicleCredentials(): { email: string; password: string } {
  return {
    email: process.env.NO_VEHICLE_EMAIL ?? 'reacharavindh.s14+999@gmail.com',
    password: process.env.NO_VEHICLE_PASSWORD ?? 'Password@123',
  };
}
