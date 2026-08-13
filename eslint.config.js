// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

/**
 * Replaces the tslint + codelyzer setup that used to live in tslint.json.
 * Both were deprecated, and codelyzer bundled @angular/core@9 as a dependency,
 * which kept a decade-old Angular in the tree and with it a set of XSS
 * advisories that had nothing to do with the app's own Angular version.
 *
 * The rule set is deliberately close to the recommended defaults.
 */
module.exports = tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**"
    ]
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" }
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" }
      ],
      // This codebase predates strict typing conventions; these would otherwise
      // report thousands of pre-existing violations and drown out new ones.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {}
  }
);
