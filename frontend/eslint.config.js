//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
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
      },
    },
];
