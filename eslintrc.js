module.exports = {
  parserOptions: {
    ecmaVersion: 2018, // or later
    sourceType: 'module', // if using ES modules
  },
  env: {
    browser: true, // if targeting browser environment
    node: true, // if targeting Node.js environment
    es2021: true, // or later
  },
  extends: ['eslint:recommended'], // or any other configurations you want to extend
};
