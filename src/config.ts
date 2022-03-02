import * as Joi from 'joi';

const msRegex =
  /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i;

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
}

export interface JwtConfig {
  accessTokenSecret: string;
  accessTokenTTL: string;
  refreshTokenSecret: string;
  refreshTokenTTL: string;
  tokenIssueDelta: string;
}

export const configFactory: () => {
  database: DatabaseConfig;
  jwt: JwtConfig;
} = () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET,
    accessTokenTTL: process.env.JWT_ACCESS_TTL,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
    refreshTokenTTL: process.env.JWT_REFRESH_TTL,
    tokenIssueDelta: process.env.JWT_TOKEN_ISSUE_DELTA ?? '1h',
  },
});

export const configSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().required().pattern(msRegex),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required().pattern(msRegex),
  JWT_TOKEN_ISSUE_DELTA: Joi.string().pattern(msRegex),
});
