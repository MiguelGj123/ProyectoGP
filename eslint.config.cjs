const js = require("@eslint/js");
const globals = require("globals");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const prettier = require("eslint-plugin-prettier");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  // 1. Ignorar carpetas globales (builds y dependencias)
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "frontend/.vite-temp/**",
    ],
  },

  // 2. Reglas base recomendadas de JS para todo el proyecto
  js.configs.recommended,

  // 3. --- FRONTEND (React con ESM) ---
  {
    files: ["frontend/src/**/*.{js,jsx}", "frontend/*.{js,jsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // Reconoce 'window', 'document', etc.
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // 4. --- BACKEND (Node con CommonJS) ---
  {
    files: ["backend/**/*.js"],
    plugins: {
      prettier: prettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node, // Reconoce 'process', '__dirname', 'require', etc.
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },

  // 5. --- TESTS (Preparación para futuros Sprints) ---
  {
    files: [
      "**/*.test.js",
      "**/*.test.jsx",
      "**/tests/**/*.js",
      "**/tests/**/*.jsx",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // 6. Desactiva reglas de ESLint que entren en conflicto con Prettier (Debe ir al final)
  eslintConfigPrettier,
];
