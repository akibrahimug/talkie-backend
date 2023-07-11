import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/test/*.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/test/*.ts?(x)',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  coverageReporters: ['text-summary', 'lcov'],
  moduleNameMapper: {
    '@auth/(.*)': ['<rootDir>/src/Features/auth/$1'],
    '@user/(.*)': ['<rootDir>/src/Features/user/$1'],
    '@global/(.*)': ['<rootDir>/src/Shared/globals/$1'],
    '@service/(.*)': ['<rootDir>/src/Shared/services/$1'],
    '@socket/(.*)': ['<rootDir>/src/Shared/sockets/$1'],
    '@worker/(.*)': ['<rootDir>/src/Shared/workers/$1'],
    '@post/(.*)': ['<rootDir>/src/Shared/post/$1'],
    '@reaction/(.*)': ['<rootDir>/src/Features/reactions/$1'],
    '@comment/(.*)': ['<rootDir>/src/Features/comments/$1'],
    '@notification/(.*)': ['<rootDir>/src/Features/notifications/$1'],
    '@image/(.*)': ['<rootDir>/src/Features/images/$1'],
    '@chat/(.*)': ['<rootDir>/src/Features/chat/$1'],
    '@root/(.*)': ['<rootDir>/src/$1'],
  },
};

export default config;
