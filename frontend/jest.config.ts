import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['tsx', 'ts', 'jsx', 'js'],
};
export default config;
