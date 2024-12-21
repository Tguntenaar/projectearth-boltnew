// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    // Add any module name mappings here if needed
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-module-to-transform/)", // Adjust this if you need to transform specific node_modules
  ],
};
