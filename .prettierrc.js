module.exports = {
  semi: true, // Adds a semi-colon after every JS statement
  trailingComma: 'all', // Add a trailing comma whenever possible
  singleQuote: true, // Use single quotes instead of double quotes by default
  printWidth: 80,
  plugins: [
    'prettier-plugin-sort-json',
    'prettier-plugin-css-order',
    '@ianvs/prettier-plugin-sort-imports',
  ],
  importOrderSafeSideEffects: ['^server-only$'],
  importOrder: [
    '^server-only$',

    '^(react/(.*)$)|^(react$)|^(react-native(.*)$)',
    '^(next/(.*)$)|^(next$)',

    '<THIRD_PARTY_MODULES>',

    // Utilities and helpers
    '^(@/lib)(/.*|$)|^(@/app)(/.*|$)|^(@/^(?!assets|components|api|graphql))(/.*|$)',

    // Api
    '^(@/api)(/.*|$)| (?:.|\\/)api$',

    // Types
    '^(@/graphql)(/.*|$)| ^\\./types',

    // Assets
    '^(@/assets)(/.*|$)',

    // Components
    '^(@/components)(/.*|$)',

    '^.+\\.(js|ts|tsx)$',
    '^\\./.*$',
    '^\\u0000',
    // Group 6: Styles
    '^.+\\.s?css$',
  ],
};
