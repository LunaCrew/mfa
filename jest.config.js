/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist'],
  coverageReporters: ['text'],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  rootDir: '.',
  modulePaths: ['<rootDir>'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {isolatedModules: true}]
  }
};