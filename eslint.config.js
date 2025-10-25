// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    ignores: ["dist/**"], // derlenmiş dosyaları kontrol etmesin
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // JavaScript önerilen kurallar
  js.configs.recommended,

  // TypeScript için önerilen kurallar
  ...tseslint.configs.recommended,

  // Ek TypeScript kuralları
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": ["error"],
      "@typescript-eslint/explicit-module-boundary-types": ["error"],
      "@typescript-eslint/typedef": [
        "error",
        {
          arrayDestructuring: true,
          arrowParameter: true,
          memberVariableDeclaration: true,
          objectDestructuring: true,
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: false,
        },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-inferrable-types": "off", // açık tipleri kaldırma
    },
  },
]);
