import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Define the shape of our environment variables
export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
}

// Helper function to get environment variable or throw error
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

// Parse and validate environment variables
const envConfig: EnvConfig = {
  NODE_ENV: getEnv('NODE_ENV'),
  PORT: parseInt(getEnv('PORT'), 10),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  DATABASE_URL: getEnv('DATABASE_URL'),
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),
};

// Export the validated config
export default envConfig;