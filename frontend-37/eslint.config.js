import globals from "globals";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";

export default [
  // Базовые правила ESLint
  js.configs.recommended,

  // Настройки для React
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin, // Правильный формат плагинов в Flat Config
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        React: "readonly", // Глобальный React не требуется импортировать
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Включаем поддержку JSX
        },
      },
    },
    rules: {
      "no-unused-vars": "off",
      // React-специфичные правила
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "error",
      "react/prop-types": "off", // Отключаем проверку prop-types

      // Дополнительные правила по желанию
      "react/jsx-key": "error", // Проверка key в массивах
    },
    settings: {
      react: {
        version: "detect", // Автоматически определяет версию React
      },
    },
  },

  // Игнорируемые файлы (замена .eslintignore)
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/*.config.js"],
  },
];
