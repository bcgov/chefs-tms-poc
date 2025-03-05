import vuetify from "eslint-plugin-vuetify";
import prettier from "eslint-plugin-prettier";
import pluginVue from 'eslint-plugin-vue';
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...pluginVue.configs['flat/recommended'],
    {
    ignores: ["**/node_modules/"],
}, ...compat.extends(
    "eslint:recommended",
    "prettier",
    "plugin:vuetify/base",
), {
    plugins: {
        vuetify,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            ...globals.jest,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
            _: false,
        },

        ecmaVersion: 2020,
        sourceType: "module",
    },

    rules: {
        "prettier/prettier": "error",

        "no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "eol-last": ["error", "always"],
        "linebreak-style": ["error", "unix"],
        "no-console": "warn",
        "no-debugger": "warn",
        semi: ["error", "always"],

        "vue/html-closing-bracket-newline": ["off", {
            singleline: "never",
            multiline: "never",
        }],

        "vue/max-attributes-per-line": ["off", {
            singleline: 1,

            multiline: {
                max: 1,
                allowFirstLine: true,
            },
        }],

        "vue/multi-word-component-names": "off",

        "vue/no-multi-spaces": ["error", {
            ignoreProperties: false,
        }],

        "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
        "vuetify/no-deprecated-classes": "error",
        "vuetify/grid-unknown-attributes": "error",
        "vuetify/no-deprecated-components": "off",
        "vue/v-on-event-hyphenation": "off",
        "vue/no-v-html": "off",
    },
}, {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}];