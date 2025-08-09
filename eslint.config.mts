import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";
import betterTailwind from "eslint-plugin-better-tailwindcss";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  // Baseline JS rules with file patterns and browser globals
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },

  // Core recommended configs
  js.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginPrettier,

  // Next.js & TypeScript best practices
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  // Modern JS/TS best practices with unicorn
  {
    plugins: { unicorn },
    rules: {
      "unicorn/prevent-abbreviations": "off", // less strict for framework naming
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
    },
  },

  // Tailwind v4 compatible linting
  betterTailwind.configs.recommended,

  // Global ignores and rules
  {
    ignores: ["components/ui/**", "node_modules/**", ".next/**"],
    rules: {
      "no-undef": "off",
    },
  },

  // TypeScript-specific overrides
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
