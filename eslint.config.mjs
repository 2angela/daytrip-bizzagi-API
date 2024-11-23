import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    rules: {
      "no-duplicate-imports": "error",
      "no-use-before-define": "error",
      "no-useless-assignment": "warn"
    }
  },
  pluginJs.configs.recommended
];
