import { compare, hash } from 'bcrypt';
import { createHash } from 'crypto';

export const dummyHash =
  '$2b$10$fP3zDz.WJWFl1Emxv/tPWO.r3ixniOH3R6kBlO03aaT9ZRaGJRVym';

export function sha256(string: string) {
  return createHash('sha256').update(string).digest('base64');
}

export async function secure(string: string) {
  return hash(sha256(string), 10);
}

export async function compareHash(password: string, hash?: string) {
  return compare(sha256(password), hash ?? dummyHash);
}
