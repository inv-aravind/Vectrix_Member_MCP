const localPart = process.env.REGISTRATION_EMAIL_LOCAL_PART ?? 'reacharavindh.s14';
const domain = process.env.REGISTRATION_EMAIL_DOMAIN ?? 'gmail.com';

export function buildRegistrationEmail(timestamp?: number | string): string {
  const ts = timestamp ?? Date.now();
  return `${localPart}+${ts}@${domain}`;
}
