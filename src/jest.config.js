module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',  // Usar ts-jest para archivos TypeScript
    },
    transformIgnorePatterns: ['/node_modules/'],  // Ignorar node_modules
    verbose: true,
    testTimeout: 30000,
  };
  