// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  rules: {
    // Disable the import/no-unresolved rule for now 
    'import/no-unresolved': 'off',
  }
};
