module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    "next/core-web-vitals",
    "standard-with-typescript",
    "plugin:react/recommended",
    "airbnb-typescript",
    "prettier"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    project: "tsconfig.eslint.json",
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/promise-function-async": "off",
    "import/no-duplicates": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/dot-notation": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/prefer-optional-chain": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "import/no-extraneous-dependencies": "off",
    "object-shorthand": "off",
    "no-unneeded-ternary": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "array-callback-return": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off"
  }
};
