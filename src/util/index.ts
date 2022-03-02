import ms, { StringValue } from 'ms';

export * from './password';
export * from './time';

export function s(value: string) {
  return Math.round(ms(value as StringValue) / 1000);
}
