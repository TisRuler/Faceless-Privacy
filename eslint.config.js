const { FlatCompat } = require("@eslint/eslintrc");
const unusedImports = require("eslint-plugin-unused-imports");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

module.exports = [
  // Extend Next.js core rules
  ...compat.extends("next/core-web-vitals"),

  // Custom rules with plugins
  {
    plugins: {
      "unused-imports": unusedImports,
      tailwindcss: require("eslint-plugin-tailwindcss"),
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],

      // Auto-remove unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", ignoreRestSiblings: true },
      ],

      // Tailwind class order enforcement
      "tailwindcss/classnames-order": "error",
    },
    settings: {
      tailwindcss: {
        config: "./tailwind.config.js",
      },
    },
  },

  // Files/folders to ignore
  {
    ignores: [
      "**/assets/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/*.min.js",
      "**/*.config.js",
    ],
  },
];
