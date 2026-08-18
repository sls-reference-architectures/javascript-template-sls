import baseConfig from './jest.config.js';

const config = {
  ...baseConfig,
  globalSetup: './test/common/jest.e2e.setup',
  setupFilesAfterEnv: [...baseConfig.setupFilesAfterEnv, './test/signRequests.e2e.js'],
};

export default config;
