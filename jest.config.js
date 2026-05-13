module.exports = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "biztrack-logic.js",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/tests/**"
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      functions: 80,
      lines: 80
    }
  }
};