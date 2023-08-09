module.exports = {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended', // Make sure this is always the last configuration in the extends array
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
      // Add your custom rules here
      'react/prop-types': 'off', // You can turn off certain rules if they don't align with your project's requirements
    },
  };
  