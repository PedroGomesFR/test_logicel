module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: [
    'models/**/*.js',
    'routes/**/*.js',
    '!node_modules/**'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true
};
