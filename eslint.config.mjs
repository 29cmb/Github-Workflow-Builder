import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [...compat.extends("eslint:recommended"), includeIgnoreFile(gitignorePath), {
    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        "no-console": "off",
        "no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "prefer-const": "off",
        "no-case-declarations": "off"
    },

    ignores: ["client/"],
}];