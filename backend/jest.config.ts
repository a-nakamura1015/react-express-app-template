import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};
export default config;
