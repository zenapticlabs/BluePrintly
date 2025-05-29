import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules by setting them to "off" or 0
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      // You can also set rules to warn instead of error using "warn" or 1
      "react/no-unescaped-entities": "warn",
    },
  },
];

export default eslintConfig;
