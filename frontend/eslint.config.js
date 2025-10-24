//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    ignores: [
      "**/*.json",
      "**/package.json",
      "**/package-lock.json",
      "**/tsconfig.json",
      "**/vercel.json",
      "**/.cta.json",
      "**/prettier.config.js",
      "**/vite.config.ts",
      "**/eslint.config.js",
      "**/dist/**",
      "**/node_modules/**",
      "**/public/**",
    ],
  },
  {
    rules: {
      // Disable import sorting rules
      "import/order": "off",
      "simple-import-sort/imports": "off",
      "simple-import-sort/exports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "sort-imports": "off",
      "import/consistent-type-specifier-style": "off",
      "@typescript-eslint/array-type": "off",
      // Disable problematic import rules
      "import/no-cycle": "off",
      "import/no-unresolved": "off",
      // Disable strict rules that are causing issues
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "import/no-duplicates": "warn",
      "no-shadow": "warn",
    },
  },
];
